import getConfig from 'next/config';

import requestHandler from './requestHandler';

const { publicRuntimeConfig } = getConfig();

export async function upgrateToAgent(body) {
  const { SERVER } = publicRuntimeConfig;

  try {
    const { data } = await requestHandler.post({
      body,
      url: SERVER.URLS.ADMIN.UPGRADE_TO_AGENT,
    });

    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
}
