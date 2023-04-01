import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import * as google from '@cdktf/provider-google';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new google.provider.GoogleProvider(this, 'google', {
      project: 'cdktf-example',
    });

    new google.storageBucket.StorageBucket(this, 'storage', {
      location: 'asia-northeast1',
      name: 'cdk-example-terraform-backend',
      storageClass: "STANDARD",
      versioning: {
        enabled: true,
      },
    });
  }
}

const app = new App();
new MyStack(app, "01-storage");
app.synth();
