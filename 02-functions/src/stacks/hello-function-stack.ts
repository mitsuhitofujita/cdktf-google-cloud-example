import { Construct } from "constructs";
import { AssetType, GcsBackend, TerraformAsset, TerraformOutput, TerraformStack } from "cdktf";
import * as google from '@cdktf/provider-google';
import path = require("path");

export interface HelloFunctionStackConfig {
  backend: {
    bucket: string;
    prefix: string;
  },
  provider: {
    project: string;
    region: string;
  }
  domain: string;
  environment: string;
  project: string;
  region: string;
}

export class HelloFunctionStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: HelloFunctionStackConfig) {
    super(scope, id);

    const prefix = `${config.domain}-${config.project}`;

    new GcsBackend(this, {
        bucket: config.backend.bucket,
        prefix: config.backend.prefix,
    });

    new google.provider.GoogleProvider(this, 'google', {
        project: config.provider.project,
        region: config.provider.region,
    });
    
    const asset = new TerraformAsset(this, `${id}_asset`, {
      path: path.resolve('functions/hello'),
      type: AssetType.ARCHIVE,
    });

    const bucket = new google.storageBucket.StorageBucket(this, `${id}_bucket`, {
      name: `${prefix}-${config.environment}`,
      location: config.region,
    });

    const archive = new google.storageBucketObject.StorageBucketObject(this, `${id}_archive`, {
      name: 'hello/index.zip',
      bucket: bucket.name,
      source: asset.path,
    });

    new TerraformOutput(this, `${id}_bucket_output`, {
      value: bucket.id,
    });

    const cloudFunction = new google.cloudfunctionsFunction.CloudfunctionsFunction(this, `${id}_function`, {
      name: "hello",
      runtime: "nodejs18",
      availableMemoryMb: 128,
      sourceArchiveBucket: bucket.name,
      sourceArchiveObject: archive.name,
      triggerHttp: true,
      entryPoint: "hello",
    });

    new google.cloudfunctionsFunctionIamMember.CloudfunctionsFunctionIamMember(this, `${id}_function_invoker`, {
      project: cloudFunction.project,
      region: cloudFunction.region,
      cloudFunction: cloudFunction.name,
      role: "roles/cloudfunctions.invoker",
      member: "allUsers",
    });

    new TerraformOutput(this, `${id}_function_url_output`, {
      value: cloudFunction.httpsTriggerUrl,
    });

    /*
    const func = new google.cloudfunctions2Function.Cloudfunctions2Function(this, `${id}_function`, {
      name: "hello",
      location: config.region,
      buildConfig: {
        runtime: "nodejs18",
        entryPoint: "hello",
        source: {
          storageSource: {
            bucket: bucket.name,
            object: archive.name,
          }
        }
      },
      serviceConfig: {
        maxInstanceCount: 1,
        availableMemory: "256M",
        timeoutSeconds: 10,
      }
    });

    new TerraformOutput(this, `${id}_function_url_output`, {
      value: func.serviceConfig.uri,
    });

    new google.cloudfunctions2FunctionIamMember.Cloudfunctions2FunctionIamMember(this, `${id}_invoker`, {
      project: func.project,
      location: func.location,
      cloudFunction: func.name,
      role: "roles/cloudfunctions.invoker",
      member: "allUsers",
    })

    new google.cloudfunctions2FunctionIamBinding.Cloudfunctions2FunctionIamBinding(this, `${id}_binding`, {
      project: func.project,
      location: func.location,
      cloudFunction: func.name,
      role: "roles/cloudfunctions.invoker",
      members: [
        "allUsers",
      ]
    });
    */
  }
}
