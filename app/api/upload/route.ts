import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function hmac(key: crypto.BinaryLike, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function createPresignedGetUrl({
  bucket,
  region,
  accessKey,
  secretKey,
  objectKey,
  expiresInSeconds = 604800, 
}: {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
  objectKey: string;
  expiresInSeconds?: number;
}) {
  const host = `${bucket}.s3.${region}.amazonaws.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKey}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresInSeconds),
    "X-Amz-SignedHeaders": "host",
  });
  queryParams.sort();
  const canonicalQueryString = queryParams.toString();

  const canonicalRequest = [
    "GET",
    `/${objectKey}`,
    canonicalQueryString,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  return `https://${host}/${objectKey}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || "us-east-1";
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectKey = `uploads/${Date.now()}-${cleanName}`;

    if (!bucket || !accessKey || !secretKey) {
      const simulatedUrl = `https://constructora-erp.s3.${region}.amazonaws.com/${objectKey}`;
      return NextResponse.json({
        url: simulatedUrl,
        mode: "simulated",
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const host = `${bucket}.s3.${region}.amazonaws.com`;
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = sha256(buffer);

    const canonicalHeaders =
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest = [
      "PUT",
      `/${objectKey}`,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      sha256(canonicalRequest),
    ].join("\n");

    const kDate = hmac(`AWS4${secretKey}`, dateStamp);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, "s3");
    const kSigning = hmac(kService, "aws4_request");
    const signature = crypto
      .createHmac("sha256", kSigning)
      .update(stringToSign, "utf8")
      .digest("hex");

    const authHeader =
      `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const s3Url = `https://${host}/${objectKey}`;
    const s3Res = await fetch(s3Url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "x-amz-content-sha256": payloadHash,
        "x-amz-date": amzDate,
        Authorization: authHeader,
      },
      body: buffer,
    });

    if (!s3Res.ok) {
      const errText = await s3Res.text();
      return NextResponse.json(
        { error: `Error subiendo a AWS S3 (${s3Res.status}): ${errText}` },
        { status: 500 }
      );
    }

    const viewUrl = createPresignedGetUrl({
      bucket,
      region,
      accessKey,
      secretKey,
      objectKey,
    });

    return NextResponse.json({ url: viewUrl, mode: "aws-s3" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al subir archivo" },
      { status: 500 }
    );
  }
}
