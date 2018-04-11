export interface IBaseValidator {
    validator: (v: any) => boolean,
    message: string
}

class BaseValidator implements IBaseValidator{
    validator(v: any) {
        return true;
    }
    message = 'BaseValidator default message. Should not be seeing this.'

    use() {
        let v =  <IBaseValidator>{
            validator: this.validator,
            message: this.message
        }
        return v;
    }
}

export default BaseValidator;