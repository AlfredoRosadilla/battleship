import React from 'react';
import { useRouter } from 'next/router';

import { HTTP_CODES } from '../../utils/httpsCodes';
import { Wrapper, PageErrorDescription } from './errorPage.style';
import { getAESEncryption, getQueryFormat } from '../../utils/client/crypto';

/**
 * Errors Pages
 * @returns ErrorPage instance
 */
function ErrorPage() {
  const router = useRouter();
  const testId = 'error-page';
  const { errorCode } = router.query;
  const errorCodeData = HTTP_CODES.getCodeDescription(errorCode);

  return (
    <Wrapper
      data-testid={`${testId}-container`}
      className="hero is-primary is-fullheight"
    >
      <PageErrorDescription>{errorCodeData}</PageErrorDescription>
    </Wrapper>
  );
}

/**
 * Controller
 */
export function Methods() {}

/**
 * Try to log in the user
 * @param {object} event form submit event
 */
Methods.prototype.logIn = function logIn(event) {
  const user = this.userInputRef.current.value;
  const password = this.passwordInputRef.current.value;
  const data = getQueryFormat(
    getAESEncryption(
      JSON.stringify({ user, password }),
      process.env.CSR_ENCRYPT_SECRET,
    ),
  );

  event.preventDefault();

  this.router.push(`/auth?data=${data}`);
};

export default ErrorPage;
