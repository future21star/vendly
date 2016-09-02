SirTrevor.Blocks.Textentry = SirTrevor.Block.extend({

	type: "textentry",

	title: function() { return 'Text Entry'; },

	editorHTML: '<input type=text class="st-input-string js-caption-input" name="question" placeholder="Enter your question..." style="width: 100%; margin-top: 10px; text-align: left;"><br><p class="st-input-string js-caption-input" style="width: 75%; font-style: italic; text-align: left; border-bottom: 1px solid #AAAAAA; color: #BBBBBB; font-weight: 100; cursor: default;" disabled>Client\'s Response</p>',

	icon_name: 'quote',

	loadData: function(data){
		this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
		this.$('.js-caption-input').val(data.caption);
	}
});

SirTrevor.Blocks.Checkbox = SirTrevor.Block.extend({

	type: "checkbox",

	title: function() { return 'Multiple Choice'; },

    editorHTML: '<input type="text" class="st-input-string js-caption-input" name="question" placeholder="Enter your question..."><ul style="list-style-type: none;"><li><input type="checkbox" style="margin-right: 10px; cursor: default;" disabled><input type="text" class="st-required" name="option" placeholder="Option" value="Option"></li><li><input type="checkbox" style="margin-right: 10px; cursor: default;" disabled><input type="text" class="st-required" name="option" placeholder="Add Option"></li></ul>',

	icon_name: 'list',

	loadData: function(data){
		this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
		this.$('.js-caption-input').val(data.caption);
	}
});

//SirTrevor.Blocks.Code = SirTrevor.Block.extend({
//
//	type: "code",
//
//	title: function() { return 'Code'; },
//
//	editorHTML: '<pre class="st-required st-text-block" style="text-align: left; font-size: 0.75em;" contenteditable="true"></pre><input type=text class="st-input-string js-caption-input" name=caption placeholder="Caption" style="width: 100%; margin-top: 10px; text-align: center">',
//
//	icon_name: 'quote',
//
//	loadData: function(data){
//		this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
//		this.$('.js-caption-input').val(data.caption);
//	}
//});
