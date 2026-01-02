const {validationResult}=require('express-validator');
const removeUploadImg = require('../../util/removeUploadImg');

exports.validate=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        removeUploadImg(req.file);
        return res.status(400).json({
            success:false,
            errors:errors.array().map((err) => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};
