import getConfig from 'next/config';

import HTTP_CODES from './../../utils/httpsCodes';
import { Logger, LogLevels } from './../../utils/logger';
import requestHandler, {
  getResolvedBody,
} from './../../utils/backend/requestHandler';

const { serverRuntimeConfig } = getConfig();

const logger = new Logger();

export default async function handler(req, res) {
  res.status(200).json();
}
