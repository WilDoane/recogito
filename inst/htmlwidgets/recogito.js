HTMLWidgets.widget({
  name: 'recogito',
  type: 'output',
  factory: function(el, width, height) {
    var formatter = function(annotation) {
      return "tag-".concat(annotation.body[0].value)
    }
    var r = Recogito.init({
      content: el.parentNode.id,
      formatter: formatter,
      readOnly: false
    });
    return {
      renderValue: function(x) {
        el.innerText = x.text;
        r.on('updateAnnotation', function(a) {
          Shiny.setInputValue(x.inputId, JSON.stringify(r.getAnnotations()));
        });
        r.on('createAnnotation', function(a) {
          Shiny.setInputValue(x.inputId, JSON.stringify(r.getAnnotations()));
        });
        r.on('deleteAnnotation', function(a) {
          Shiny.setInputValue(x.inputId, JSON.stringify(r.getAnnotations()));
        });
        r.on('updateAnnotation', function(a) {
          Shiny.setInputValue(x.inputId+"_update", "[" + JSON.stringify(a) + "]");
        });
        r.on('createAnnotation', function(a) {
          Shiny.setInputValue(x.inputId+"_create", "[" + JSON.stringify(a) + "]");
        });
        r.on('deleteAnnotation', function(a) {
          Shiny.setInputValue(x.inputId+"_delete", "[" + JSON.stringify(a) + "]");
        });
        r.clearAnnotations();
        if(x.annotations != "{}" & x.annotations != '[""]'){
            r.setAnnotations(JSON.parse(x.annotations))
        }
        Shiny.setInputValue(x.inputId, JSON.stringify(r.getAnnotations()));
        // Allow to switch between relation/annotation mode
        var toggleModeBtn = document.getElementById(el.id.concat("-toggle"));
        r.setMode('ANNOTATION');
        toggleModeBtn.innerHTML = 'MODE: ANNOTATION';
        annotationMode = toggleModeBtn.innerHTML;
        if (annotationMode === 'MODE: RELATIONS') {
          annotationMode = 'RELATIONS';
        } else  {
          annotationMode = 'ANNOTATION';
        }
        toggleModeBtn.addEventListener('click', function() {
          if (annotationMode === 'ANNOTATION') {
            toggleModeBtn.innerHTML = 'MODE: RELATIONS';
            annotationMode = 'RELATIONS';
          } else  {
            toggleModeBtn.innerHTML = 'MODE: ANNOTATION';
            annotationMode = 'ANNOTATION';
          }
          r.setMode(annotationMode);
        });
        // Quick selector widget showing buttons on top of the annotation widget
        var tagSelectorWidget = function(args) {
          // Triggers callbacks on user action
          var addTag = function(evt) {
            args.onAppendBody({
              type: 'TextualBody',
              purpose: 'tagging',
              value: evt.target.dataset.tag
            });
          };
          // Render the top buttons on top of the widget, using default shiny btn btn-default classes
          var createButton = function(value) {
            var button = document.createElement('button');
            button.className = "btn btn-default";
            button.dataset.tag = value;
            button.textContent = value;
            button.addEventListener('click', addTag);
            return button;
          };
          var container = document.createElement('div');
          container.className = 'tagset-quickselector-widget';
          tagset = x.tags;
          for (let i = 0; i < tagset.length; i++) {
            container.appendChild(createButton(tagset[i]));
          }
          return container;
        };
        r.widgets = [
            tagSelectorWidget,
            { widget: 'COMMENT' },
            { widget: 'TAG', vocabulary: x.tags }
          ];
      },
      resize: function(width, height) {
      }
    };
  }
});
