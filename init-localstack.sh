#!/bin/bash

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
sleep 10

# Create S3 bucket
echo "Creating S3 bucket..."
aws s3 mb s3://wealthcon-bucket --endpoint-url=http://localhost:4566 --region=us-east-1

# Verify bucket creation
echo "Listing buckets..."
aws s3 ls --endpoint-url=http://localhost:4566 --region=us-east-1

echo "LocalStack initialization complete!"
