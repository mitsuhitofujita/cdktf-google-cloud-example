import { Construct } from "constructs";
import { GcsBackend, TerraformOutput, TerraformStack } from "cdktf";
import * as google from '@cdktf/provider-google';

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

    const storage = new google.storageBucket.StorageBucket(this, `${id}_storage`, {
      name: `${prefix}-storage-${config.environment}`,
      location: config.region,
      storageClass: "STANDARD",
      versioning: {
        enabled: true,
      },
    });

    new TerraformOutput(this, `${id}_storage_output`, {
      value: storage.id,
    });
  }
}
