import uuid from 'node-uuid';

export default function fillTemplateWithContent(indexTpl, webpackStatJsonData, cfg, req, content, serializedData) {
  const fbTitle = 'facebook title';
  const twitterTitle = fbTitle;
  const description = 'some description';

  const image = (req.query.fb && req.query.fb.length > 2) ?
    'http://' + req.headers.host + cfg.K_SERVER_PATH + '/assets/images/logo_for_social.jpg' :
    'http://' + req.headers.host + cfg.K_SERVER_PATH + '/assets/images/logo_for_social.jpg';

  return indexTpl({
    config: {
      K_SERVER_PATH: cfg.K_SERVER_PATH,
      K_SCRIPT_URL: webpackStatJsonData.K_SCRIPT_URL,
      K_STYLE_URL: webpackStatJsonData.K_STYLE_URL,
      K_SCRIPT_COMMONS_URL: webpackStatJsonData.K_SCRIPT_COMMONS_URL,
      K_SCRIPT_FAKER_URL: webpackStatJsonData.K_SCRIPT_FAKER_URL,
      K_SESSION_UUID: uuid.v4(),
      K_PRERENDERED_CONTENT: content,
      K_SERIALIZED_DATA: serializedData
    },

    FB: {
      image: image, // 'http://' + req.headers.host +  '/assets/images/private-beach.jpg',
      title: fbTitle,
      description: description
    },

    twitter: {
      image: image, // 'http://' + req.headers.host +  '/assets/images/private-beach.jpg',
      title: twitterTitle,
      description: description
    }
  });
}
