"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cdkapp1Stack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const main_1 = require("../../test-cdk/src/main");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class Cdkapp1Stack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        // example resource
        // const queue = new sqs.Queue(this, 'Cdkapp1Queue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
        new main_1.MyStack(this, 'OK-stack', {});
    }
}
exports.Cdkapp1Stack = Cdkapp1Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrYXBwMS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNka2FwcDEtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBRWhELGtEQUFrRDtBQUNsRCw4Q0FBOEM7QUFFOUMsTUFBYSxZQUFhLFNBQVEsbUJBQUs7SUFDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFFN0MsbUJBQW1CO1FBQ25CLHNEQUFzRDtRQUN0RCxpREFBaUQ7UUFDakQsTUFBTTtRQUNOLElBQUksY0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFDN0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBYkQsb0NBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTXlTdGFjayB9IGZyb20gJy4uLy4uL3Rlc3QtY2RrL3NyYy9tYWluJztcbi8vIGltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcblxuZXhwb3J0IGNsYXNzIENka2FwcDFTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcblxuICAgIC8vIGV4YW1wbGUgcmVzb3VyY2VcbiAgICAvLyBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0Nka2FwcDFRdWV1ZScsIHtcbiAgICAvLyAgIHZpc2liaWxpdHlUaW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMDApXG4gICAgLy8gfSk7XG4gICAgbmV3IE15U3RhY2sodGhpcywgJ09LLXN0YWNrJywge1xuICAgIH0pO1xuICB9XG59XG4iXX0=