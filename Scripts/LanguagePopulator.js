var fileName;
var langPrefix;

function provideLanguageOption() {
    $.blockUI({ message: $('#divLangSel'), css: { backgroundColor: 'black', width: '400px', height: 'auto'} });
}

function checkLanguage() {
    // Get query string
    var queryString = window.location.search.substring(1);
    var gy = queryString.split("?lang=");

    // Check for 3 letter language prefix
    langPrefix = gy[0].substr(gy[0].length - 3, 3);

    // Prefix is present set filename otherwise provide language option
    if (langPrefix.length < 3) {
        provideLanguageOption();
    } else {

        fileName = "norys" + langPrefix + ".xml";

        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: fileName,
                dataType: "xml",
                success: parseXml,
                error: problem
            });
        });
    }
}

function problem(XMLHttpRequest, textStatus, errorThrown) {
    alert(XMLHttpRequest + " | " + textStatus + " | " + errorThrown);
}

function parseXml(xml) {
    // Populate the common elements such as the menu
    populateCommonElements(xml);

    // Populate the page specifc elements such as the title
    var url = window.location.pathname;
    var file = url.substring(url.lastIndexOf('/') + 1);
    populatePageSpecificElements(xml, file);
    setButtonValue(xml, file);

    // Trim stuff

    $("#divMainContainer").attr("style", "display:");
}

function populateCommonElements(xml) {
    $(xml).find("commonelements").find("element").each(function () {

        // Get the element id 
        var id = $(this).attr("name");
        // Get the text to append to element
        var content = $(this).text();

        // Append content to element
        $("#" + id).append(content);

        // Add language prefix
        setHyperlinkLanguagePrefix(id)
    });
}

function populatePageSpecificElements(xml, file) {
    $(xml).find("page[name=" + file + "]").find("element").each(function () {
        var content = $(this).text();
        var id = $(this).attr("name");

        var elementContent =$.trim( $("#" + id).text());

        if (elementContent.length > 0) {
            $("#" + id).append("<br/><br/>" + content);
        }
        else {
            $("#" + id).append(content);
        }

        setHyperlinkLanguagePrefix(id)
    });
}

function setHyperlinkLanguagePrefix(id) {
    // Should the element have a href attribute set the language prefix
    var link = $("#" + id + "[href]").attr("href");
    $("#" + id + "[href]").attr("href", link + "?lang=" + langPrefix);
}

function setButtonValue(xml, file) {

    $(xml).find("page[name=" + file + "]").find("formButtonElement").each(function () {
        var content = $(this).text();
        var id = $(this).attr("name");

        $("#" + id).attr("value",$.trim(content));
    });
}