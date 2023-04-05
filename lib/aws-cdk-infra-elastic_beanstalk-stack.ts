import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as iam from 'aws-cdk-lib/aws-iam';

// import path = require('path');
// import s3assets = require('@aws-cdk/aws-s3-assets');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkInfraElasticBeanstalkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Phase1:  Construct an S3 asset from the ZIP located from directory up.
    const webAppZipArchive = new Asset(this, 'poem-WebAppZip', {
        path: `${__dirname}/../poem-NodeApp.zip`,
        // path.join(__dirname, '../poem-NodeApp.zip'),
    } );

    // Phase2: Create a ElasticBeanStalk app.
    const appName = 'poem-NodeApp'; //defining a Name for ELB App
    const app = new elasticbeanstalk.CfnApplication(this, 'Application', {
        applicationName: appName,
    });

    // Phase3:  Create Elastic Beanstalk application version
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
    appVersionProps.addDependency(app)   // deprecated --> //addDependsOn(app);

    
    // Phase4: Create role and instance profile
    const myRoleEc2 = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    }); // create a new role;
    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    myRoleEc2.addManagedPolicy(managedPolicy); // attaching the defined policy

    const myProfileName = `${appName}-InstanceProfile`; // create profilename
    //const instanceProfile = 
    new iam.CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [
          myRoleEc2.roleName
      ]
    }); // end instnaceProfile

    // Phase 5: Configuring Some options which can be used for ELB Environment
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
    //const elbEnv = 
    new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'poem-NodeAppEnvironment',
      applicationName: app.applicationName || appName,
      solutionStackName: '64bit Amazon Linux 2 v5.8.0 running Node.js 18',
      optionSettings: optionSettingProperties,
      versionLabel: appVersionProps.ref,
    });

  }
}
