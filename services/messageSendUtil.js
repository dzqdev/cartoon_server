//发送短信的工具函数
/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = ''
const secretAccessKey = ''
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//发送短信


exports.sendSMS = function(phone,code,success,fail){
    let TemplateParam = '{"code":' + '"' + code + '"' +'}';
    console.log(TemplateParam);
    smsClient.sendSMS({
        PhoneNumbers: phone,
        SignName: 'flymix消息',
        TemplateCode: 'SMS_115390177',
        TemplateParam: TemplateParam
    }).then(success,fail)
}

/**
 * function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    }
 */

