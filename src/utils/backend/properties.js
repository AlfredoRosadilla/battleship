import getConfig from 'next/config';

import requestHandler from './requestHandler';

const { serverRuntimeConfig } = getConfig();

function getProperties({
  page,
  pageSize,

  sortBy,

  searchByText,
}) {}

export async function getProperty(ctx, propertyUrl) {
  const { req, res } = ctx;
  const { SERVER } = serverRuntimeConfig;
  let propertyMeta = { error: true };

  try {
    const { data } = await requestHandler.get(req, res, {
      url: SERVER.URLS.GET_PROPERTY,
      queryParams: {
        url: propertyUrl,
      },
    });

    propertyMeta = data;
  } catch (error) {
    console.error(error);
  }

  return propertyMeta;
}
