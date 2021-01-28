import React from 'react';
import * as zxcvbn from 'zxcvbn';

export const strength = {
  0: {
      color: 'text-danger',
      text: "Worst 😢",
  },
  1: {
      color: 'text-warning',
      text: "Bad 😞",
  },
  2: {
      color: 'text-warning',
      text: "Weak 😐",
  },
  3: {
      color: 'text-success',
      text: "Good 😊",
  },
  4: {
      color: 'text-success',
      text: "Strong 😃"
  },
}

const isNull = (text) => text !== '' && text !== null && text !== undefined

export const PasswordStrengthMeter = ({
    text = ""
}) => {
    const result = zxcvbn(text);
    const score = strength[result.score].text;
    const warning = isNull(result.feedback.warning) ? result.feedback.warning : null;
    const suggestions = isNull(result.feedback.suggestions) ? result.feedback.suggestions : null;

    return (
        <p className="font-18">
            <b className={strength[result.score].color}>Strength: {score} </b>
            <span className="text-muted">{warning && `${warning}. `}</span>
            <span className="text-muted">{suggestions && `${suggestions}.`}</span>
        </p>
    )
}