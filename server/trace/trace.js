'use strict';

var kMESSAGES_PER_ATTACHMENT = 20;

var _ = require('underscore');
var express = require('express');
var ice_middlewares = require('ice_middlewares');
/*eslint-disable */
var config = require(__config + 'config.js');
var router = express.Router();
/*eslint-enable */

var fetch = require('node-fetch');
//var re = /[^А-Яа-яA-Za-z0-9\s\w\.\,\/\\\?!:\-_+=Ёё]+/ig;
//var clear_string = (req, param) => req && req.body && req.body[param] && (''+req.body[param]).replace(re, '___');

router
  .route('/trace/:session_uuid')
  .all(ice_middlewares.cache_middleware(0))
  .post( (req, res) => {    
    var session_uuid = req.params.session_uuid;
    var data = req.body.data;
    var data_text = _.map(data, d => 
       `${d.time} :: ${d.source} :: ${d.event_name} ( ${d.args} )`);

    var data_text_list = _.groupBy(data_text, (d, index) => Math.floor(index / kMESSAGES_PER_ATTACHMENT));


    var send_body = {
      username: 'log tehnopark',
      icon_emoji: ':ghost:',
      channel: 'logs',
      attachments: _.map(data_text_list, (msgs, kindex) => (
        {
          fallback: kindex ==='0' ?  '------------------------------ НОВЫЕ ЛОГИ SID = ' + session_uuid + ' -----------------------------------------' : '',
          pretext: kindex ==='0' ?  '------------------------------ НОВЫЕ ЛОГИ SID = ' + session_uuid + ' -----------------------------------------' : '',
          color: kindex ==='0' ? '#D0D000' : '#D00000',
          fields: [
            {
               title: 'Logs ' + kindex,
               value: msgs.join('\n'),
               short: false
            }
          ]
        }
      ))
    };

    if(_.some(data, d => d.event_name === 'send-order-click')) {
      send_body.attachments.push({
          fallback: `ОН СДЕЛАЛ ЗАКАЗ`,
          pretext: `ОН СДЕЛАЛ ЗАКАЗ`,
          color: '#00D000',
          fields: [
              {
                 title: 'СДЕЛАЛ ЗАКАЗ',
                 value: 'ура ура ура ура',
                 short: false
              }
           ]
      });

    }

    fetch(config.kSLACK_INTEGRATION, { method: 'POST', body: JSON.stringify(send_body) })
      .then(fres => {        
        var result = {...req.urllite, ...fres.json(), ok: 'ok'};
        console.log(result);
        res.json(result);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
  });


module.exports = router;
