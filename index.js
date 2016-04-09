var mandrill = require('mandrill-api/mandrill');
var _ = require('lodash');

var fieldMapping = {
	subject: 'subject',
  html: 'html',
  text: 'text',
	attachments: 'attachments',
  images: 'images',
	tags: 'tags',
  headers: 'headers',
  metadata: 'metadata',

  /*
  - 'to',
  - 'bcc',
	- 'from_email',
	- 'from_name',
	- 'recipient_metadata',
  'important',
	'track_opens',
	'track_clicks',
	'auto_text',
	'auto_html',
	'inline_css',
	'url_strip_qs',
	'preserve_recipients',
	'view_content_link',
	'tracking_domain',
	'signing_domain',
	'return_path_domain',
	'merge',
	'merge_language',
	'global_merge_vars',
	'merge_vars',
	'subaccount',
	'google_analytics_domains',
	'google_analytics_campaign',
	*/
};

var defaultOptions = {
	track_opens: true,
	track_clicks: true,
	auto_text: true,
	auto_html: true,
	//inline_css: true,
	preserve_recipients: false,
	//tracking_domain: config.host,
	//signing_domain: ,
	//return_path_domain,
	merge: true,
	merge_language: 'handlebars',
};

var mapMergeVars = function (vars) {
  var mergeVars = [];
  for (var i in vars) {
    mergeVars.push({name: i, content: vars[i]});
  }
  return mergeVars;
};

var mapOptions = function (options) {
  var mapped = {};
  for (var i in options) {
      if (fieldMapping[i]) {
        mapped[fieldMapping[i]] = options[i];
      }
  }
  mapped.from_name = options.from.name;
  mapped.from_email = options.from.email;

  //recipients
  mapped.to = [];
  for (var i = 0; i < options.to.length; i++) {
    var to = {
      name: options.to[i].name,
      email: options.to[i].email,
      to: 'to'
    };
    mapped.to.push(to);
    //recipient_metadata
    if(options.to[i].metadata)
      mapped.recipient_metadata.push({rcpt: options.to[i].email, values: options.to[i].metadata});
    //merge_vars
    if(options.to[i].data)
      mapped.merge_vars.push({rcpt: options.to[i].email, vars: mapMergeVars(options.to[i].data)});
  }
  /*for (var i = 0; options.bcc && i < options.bcc.length; i++) {
    var bcc = {
      name: options.bcc[i].name,
      email: options.bcc[i].email,
      to: 'bcc'
    };
    mapped.to.push(bcc);
    //recipient_metadata
    if(options.bcc[i].metadata)
      mapped.recipient_metadata.push({rcpt: options.bcc[i].email, values: options.bcc[i].metadata});
    //merge_vars
    if(options.bcc[i].data)
      mapped.merge_vars.push({rcpt: options.bcc[i].email, vars: mapMergeVars(options.bcc[i].data)});
  }
  for (var i = 0; options.cc && i < options.cc.length; i++) {
    var cc = {
      name: options.cc[i].name,
      email: options.cc[i].email,
      to: 'cc'
    };
    mapped.to.push(cc);
    //recipient_metadata
    if(options.cc[i].metadata)
      mapped.recipient_metadata.push({rcpt: options.cc[i].email, values: options.cc[i].metadata});
    //merge_vars
    if(options.cc[i].data)
      mapped.merge_vars.push({rcpt: options.cc[i].email, vars: mapMergeVars(options.cc[i].data)});
  }*/

  return mapped;
};

exports.send = function(credentials, options, callback) {
  var mandrillClient = new mandrill.Mandrill(credentials.apiKey);
	var mandrillConfig = _.extend(defaultOptions, mapOptions(options));

  var sendConfig = {
    message: mandrillConfig,
    async: true
  };
  if (options.ipPool)
    sendConfig.ip_pool = options.ipPool;
  if (options.sendAt)
    sendConfig.send_at = options.sendAt;

  mandrillClient.messages.send(
    sendConfig,
    function(responses) {
      callback(null, responses);
    },
    callback);
};

exports.name = 'mandrill';
