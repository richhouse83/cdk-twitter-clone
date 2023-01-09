#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkTwitterCloneStack } from '../lib/cdk-twitter-clone-stack';

class GenerateTwitterCloneApp extends cdk.App {
  constructor() {
    super();

    // DO NOT EDIT BELOW UNLESS YOU KNOW WHAT YOU ARE DOING!
    const branch: string = this.node.tryGetContext('branch');
    if (!branch) {
      throw new Error('Branch is required!');
    }

    const twitterCloneStack = new CdkTwitterCloneStack(this, `${branch}-twitterclone-stack`, {
      branch,
    })

    cdk.Tags.of(twitterCloneStack).add('Branch', branch);
  }
}

new GenerateTwitterCloneApp().synth();