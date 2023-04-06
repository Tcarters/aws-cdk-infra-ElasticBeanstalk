import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';

// import * as s3deploy from 'aws-cdk-lib';
// import path = require('path');
// import s3assets = require('@aws-cdk/aws-s3-assets');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkInfraElasticBeanstalkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    //---> PHASE 1 NOT REQUIRED ONLY FOR LEARNING PURPOSES
    //Phase 1: Create an S3 bucket
    const nodeAppS3Bucket = new Bucket(this, 'Bucket', {
      bucketName: 'nodeapp-bucket',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'S3Bucketname', {
      value: nodeAppS3Bucket.bucketName,
      description: 'NodeApp S3 bucket',
    });

    // Phase 2:  Construct an S3 asset from the ZIP located from directory up.
    const webAppZipArchive = new Asset(this, 'poem-WebAppZip', {
        path: `${__dirname}/../poem-NodeAppV2.zip`, // poem-NodeApp.zip`,
    } );
    

    //---> NOT REQUIRED FOR LEARNING PURPOSES
    
    // Phase 3: Deploy the asset to an S3 bucket
    nodeAppS3Bucket.addCorsRule({
      allowedMethods:[
        s3.HttpMethods.GET,
        s3.HttpMethods.HEAD,
        s3.HttpMethods.PUT,
        s3.HttpMethods.POST,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: ['*'],
      allowedHeaders: ['*'],
    });
    nodeAppS3Bucket.grantWrite(new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com')) ;
    // nodeAppS3Bucket.grantWrite(webAppZipArchive.addResourceMetadata(new iam.ServicePrincipal('elasticbeanstore' ) ));
    // new s3deploy. //  BucketDeployment(this, 'DeployWebApp', {
    //   sources: [s3deploy.Source.asset(`${__dirname}/../poem-NodeApp.zip`)],
    //   destinationBucket: nodeAppS3Bucket,
    // });
   
    // Phase 4: Create a ElasticBeanStalk app.
    const appName = 'poem-NodeApp'; //defining a Name for ELB App
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
        applicationName: appName,
    });

    // Phase 5:  Create Elastic Beanstalk application version
    // Create an app version from the S3 asset defined earlier
    const appVersionProps = new elasticbeanstalk.CfnApplicationVersion(this, 'AppVersion', {
      applicationName: appName,
      sourceBundle: {
          s3Bucket: webAppZipArchive.s3BucketName,
          s3Key: webAppZipArchive.s3ObjectKey,
      },
      description: 'poem-NodeAppELB',
    }); // end appVersionProps
    // Make sure that Elastic Beanstalk app exists before creating an app version
    appVersionProps.addDependency(app);   // deprecated --> //addDependsOn(app);

    
    // Phase 6: Create role and instance profile
    const myRoleEc2 = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    }); // create a new role;
    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    myRoleEc2.addManagedPolicy(managedPolicy); // attaching the defined policy

    const myProfileName = `${appName}-InstanceProfile`; // create profilename
    const instanceProfile = new iam.CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [
          myRoleEc2.roleName
      ]
    }); // end instnaceProfile

    // Phase 7: Configuring Some options which can be used for ELB Environment
    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
      {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: myProfileName,
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1',
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: '1',
      },
      {
          namespace: 'aws:ec2:instances',
          optionName: 'InstanceTypes',
          value: 't2.micro',
      },
    ]; // end optionSettingProperties

    // Create an Elastic Beanstalk environment to run the application
    const elbEnv = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'poem-NodeAppEnvironment',
      applicationName: app.applicationName || appName,
      solutionStackName: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
      optionSettings: optionSettingProperties,
      versionLabel: appVersionProps.ref,
    });

  }
}
