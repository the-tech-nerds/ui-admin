import React from "react";

export const getTextFieldTemplate = (Field, props) => {
    const { uid, required, label } = props;
    return (
        <div className="form-group row" id={`container-${uid}`}>
            <label className="col-xl-3 col-md-4"><span>{required && '*'}</span>{label}</label>
            {Field}
            <label id={`error-${uid}`} className="col-xl-3 col-md-4 text-danger"></label>
        </div>
    );
};