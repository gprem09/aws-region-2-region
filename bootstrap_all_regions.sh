#!/bin/bash

ACCOUNT_ID=731803237567
REGIONS=(
  "ap-south-1"
  "eu-north-1"
  "eu-west-3"
  "eu-west-2"
  "eu-west-1"
  "ap-northeast-3"
  "ap-northeast-2"
  "ap-northeast-1"
  "ca-central-1"
  "sa-east-1"
  "ap-southeast-1"
  "ap-southeast-2"
  "eu-central-1"
  "us-east-1"
  "us-east-2"
  "us-west-1"
  "us-west-2"
)

QUALIFIER="myqual"

for REGION in "${REGIONS[@]}"; do
  echo "Bootstrapping region: $REGION"
  cdk bootstrap --force --qualifier $QUALIFIER aws://$ACCOUNT_ID/$REGION
done
