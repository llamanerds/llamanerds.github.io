var richTimer;

tinymce.init({
	selector: '#rt-input',
plugins: 'lists',
toolbar: 'undo redo | styleselect | bold italic | link image | numlist bullist',
});

function checkTexareaSize ()
{
console.log (this.id);
}

function htmlToRt ()
{
	var text = document.getElementById("html-output").value;
	tinyMCE.get('rt-input').setContent(text);
}

function rtToHtml ()
{
	var text = tinyMCE.get('rt-input').getContent();
	document.getElementById("html-output").value = text;
}