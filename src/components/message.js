module.exports = function(app) {
  app.config([
    'formioComponentsProvider',
    function(formioComponentsProvider) {
      formioComponentsProvider.register('message', {
        icon: 'fa fa-code',
        views: [
          {
            name: 'Display',
            template: 'formio/components/message/display.html'
          },
          {
            name: 'Conditional',
            template: 'formio/components/common/conditional.html'
          }
        ],
        template: 'formio/formbuilder/message.html',
        documentation: 'http://help.form.io/userguide/#html-element-component'
      });
    }
  ]);
  app.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('formio/formbuilder/message.html',
        '<p><%{{ component.content }}%></p>'
      );

      // Create the settings markup.
      $templateCache.put('formio/components/message/display.html',
        '<ng-form>' +
          '<div class="form-group">' +
            '<label for="content" form-builder-tooltip="The content of this message element.">{{\'Content\' | formioTranslate}}</label>' +
            '<textarea class="form-control" id="content" name="content" ng-model="component.content" placeholder="Message Content" rows="3">{{ component.content }}</textarea>' +
          '</div>' +
        '</ng-form>'
      );
    }
  ]);
};
