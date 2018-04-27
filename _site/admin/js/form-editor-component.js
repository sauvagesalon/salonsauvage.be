CMS.registerEditorComponent({
    id: "form",
    label: "Form",
    pattern: '^{% include components/form.html form="*(\([a-zA-Z]+\).+)" %}',
    fields: [{
        name: 'name',
        label: 'Form name',
        widget: 'relation',
        collection: "forms",
        searchFields: ["title", "name"],
        valueField: "name"
    }],

    fromBlock: function(match) {
      return {
        name: match[1]
      };
    },

    toBlock: function(obj) {
      return '{% include components/form.html form="' + obj.name + '" %}';
    },

    toPreview: function(obj) {
      return (
        '<p class="preview-block"><strong>Form:</strong> ' + obj.name + '</p>'
      );
    }

});


