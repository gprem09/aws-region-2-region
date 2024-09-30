import { Stack, Duration } from 'aws-cdk-lib';
// import { Queue } from 'aws-cdk-lib/aws-sqs'; // Uncomment if needed

export class AwsRegion2RegionStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Example resource
    // const queue = new Queue(this, 'AwsRegion2RegionQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}
