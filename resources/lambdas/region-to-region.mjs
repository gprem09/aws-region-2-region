import { Socket } from 'net';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

const DB_REGION = 'us-west-2';
const TABLE_NAME = 'PingDB';
const THIS_REGION = process.env.THIS_REGION;
const TIME_TO_LIVE = 7 * 24 * 60 * 60;

const client = new DynamoDBClient({ region: DB_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const ec2Client = new EC2Client({ region: DB_REGION });

export const handler = async () => {
    console.log('Lambda function started');
    
    const regions = await getRegions();
    console.log('Regions to ping:', regions);
    
    for (const region of regions) {
        try {
            await pingRegion(region);
        } catch (error) {
            console.error(`Error pinging region ${region}:`, error);
        }
    }
    
    console.log('Lambda function completed');
    return {
        statusCode: 200,
        body: 'Pings Complete',
    };
};

async function getRegions() {
    const command = new DescribeRegionsCommand({});
    const response = await ec2Client.send(command);
    return response.Regions.map(region => region.RegionName);
}
  
async function pingRegion(region) {
    const url = `dynamodb.${region}.amazonaws.com`;
    const client = new Socket();
    const start = process.hrtime.bigint();
    await new Promise((resolve, reject) => {
        client.connect(443, url, () => {
            client.end();
            resolve();
        });
        client.on('error', reject);
    });
    const end = process.hrtime.bigint();
    const latency = Number(end - start) / 1e6;

    console.log(`Ping to region ${region} took ${latency} ms`);

    try {
        await storeResult(region, latency);
        console.log(`Region ${region} pinged successfully and data stored`);
    } catch (error) {
        console.error(`Error storing result for region ${region}:`, error);
    }
}

const storeResult = async (region, latency) => {
    const currentDate = new Date();
    const currentTimeInSeconds = Math.floor(currentDate.getTime()/1000);
    const expireAt = currentTimeInSeconds + TIME_TO_LIVE;
    const params = {
        TableName: TABLE_NAME,
        Item: {
            timestamp: currentDate.toISOString(),
            origin: THIS_REGION,
            destination: region,
            'destination#timestamp': `${region}#${currentDate.toISOString()}`,
            expireAt: expireAt,
            latency: latency,
        },
    };

    await ddbDocClient.send(new PutCommand(params));
};