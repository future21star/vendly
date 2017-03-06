var aws = require('aws-sdk');
var ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

module.exports = {

    getSignedURL: function(req, res) {
        if (!req.payload._id) {
            res.status(401).json({ "message": "UnauthorizedError: private profile" });
        } else {
            aws.config.update({ accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_ACCESS_KEY });
            var s3 = new aws.S3();
            var file_name = req.payload._id + '/' + req.query.file_name;
            var options = {
                Bucket: S3_BUCKET,
                Key: file_name,
                Expires: 60,
                ContentType: req.query.file_type,
                ACL: 'public-read'
            };
            s3.getSignedUrl('putObject', options, function(err, data) {
                if (err) return res.send('Error with S3');

                res.json({
                    signed_request: data,
                    url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + file_name
                });
            });
        }
    },
    getFilePath: function(req, res) {
        return 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.body.filename;
    }
};