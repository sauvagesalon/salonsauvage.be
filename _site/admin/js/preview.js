var PagePreview = createClass({
  render: function() {

    // data
    var entry = this.props.entry;
    var layout = entry.getIn(['data', 'layout']);
    var body = this.props.widgetFor('body');
    var image = entry.getIn(['data', 'image']);
    var banner = entry.getIn(['data', 'banner']);
    var aside = entry.getIn(['data', 'aside']);
    var className = layout == 'page' ? 'page' : 'page ' + layout;
    var bannerImage = layout == "post" ? banner : image;

    // partials
    var partials = {
        banner: "",
        aside: "",
        content: h('div', {className: "content"}, body),
    }

    // banner
    if (bannerImage) {
        var bannerCaption = "";
        if (bannerImage.get('caption')) {
            bannerCaption = h('figcaption', {}, bannerImage.get('caption'));
        }
        partials.banner = h('figure', {className: "banner", id: "banner"},
            h('picture', {className: "preview-img", style: {'background-image': 'url("' + bannerImage.get('url') + '")'}}, bannerCaption)
        );
    }

    // page aside
    if (layout == "page" && aside) {

        var asideCards = this.props.widgetsFor('aside').map(function(item, index) {

            var asideTitle = item.getIn(['data', 'title']);
            var asideImage = item.getIn(['data', 'image']);
            var asideDescription = item.getIn(['widgets', 'description']);
            var asideLink = item.getIn(['data', 'url']);

            var asidePartials = {
                image: "",
                title: ""
            }

            if (asideImage) {
                asidePartials.image = h('picture', {className: "preview-img", style: {'background-image': 'url("' + asideImage.get('url') + '")'}}, "");
            }

            if (asideTitle) {
                asidePartials.title = h('h3', {}, asideTitle);
            }

            return h('article', {className: 'card'}, asidePartials.image,
                h('div', {className: 'content'}, asidePartials.title, asideDescription)
            );

        });

        partials.aside = h('aside', {}, asideCards);
    }

    // post aside
    if (layout == "post" && image) {
        var imageCaption = "";
        if (image.get('caption')) {
            imageCaption = h('figcaption', {}, image.get('caption'));
        }
        partials.aside = h('aside', {},
            h('figure', {},
                h('picture', {className: "preview-img", style: {'background-image': 'url("' + image.get('url') + '")'}}), imageCaption
            )
        );
    }

    // preview
    return h("div", {"className": "main"},
      partials.banner,
      h("article", {"className": className}, partials.content, partials.aside),
    );

  }
});

CMS.registerPreviewTemplate("pages", PagePreview);
CMS.registerPreviewTemplate("posts", PagePreview);
