const cdk = require('aws-cdk-lib');
const Cdkapp1 = require('../lib/cdkapp1-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdkapp1.Cdkapp1Stack(app, 'MyTestStack');
    // THEN
    const actual = app.synth().getStackArtifact(stack.artifactId).template;
    expect(actual.Resources || {}).toEqual({});
});
