var url = "";
var rspnsTxt;
let promise;

function getText(url) {
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        
        request.open("GET", url);

        
        request.onreadystatechange = function() { // Define event listener

            // If the request is compete and was successful
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader("Content-Type");
                if (type.match("application/json")) // Make sure response is json
                    response = request.responseText;
                    resolve(response); // JSON response
            } else {
                rspnsTxt = request.status;
                rspnsTxt.onerror = () => reject(new Error('Minors failed'))
            }
        };
        request.send();
    }   
)}

// About section ===============================================================

url = "https://istclone.herokuapp.com/api/about";
promise = getText(url);

// "then()" method retrieves the JSON data when the result is reolved.
promise.then(response => {
    let data = JSON.parse(response);

    $("#aboutSection").append("<div class=\"flexTitle\"><h2>" + data.title + "</h2></div>");
    $("#aboutSection").append("<p>" + data.description + "</p>");
    $("#aboutSection").append("<p id=\"quote\">\"" + data.quote + "\"</p>");
    $("#aboutSection").append("<p>- " + data.quoteAuthor + "</p>");
},
    error => alert(`Error: ${error.message}`)
);

// Degrees section ===============================================================

url = "https://istclone.herokuapp.com/api/degrees";
promise = getText(url);

promise.then(response => {
    let data = JSON.parse(response);

    const { undergraduate, graduate } = data;

    $("#degreesSection").append("<div class=\"flexTitle\"><h2>Undergraduate Degrees</h2></div>");
    $("#degreesSection").append("<div id=\"undergraduate\"></div>");

    $("#degreesSection").append("<div class=\"flexTitle\"><h2>Graduate Degrees</h2></div>");
    $("#degreesSection").append("<div id=\"graduate\"></div>");

    $.each(undergraduate, (index, value) => {
        $("#undergraduate").append(`
            <div id="modal${index}" class="modal">
                <h4>${value.title}</h4>
                <p>${value.description}</p>
                <p id="concentration${index}">Concentrations: </p>
                <a href="#" rel="modal:close"><button class="modalButton">Close</button></a>
            </div>

            <div class="degree">
                <a href="#modal${index}" rel="modal:open">
                    ${value.title}
                </a>
            </div>`
        );

        $.each(value.concentrations, (index2, value2) => {
            $(`#concentration${index}`).append(`${value2}, `);
        });
    });

    $.each(graduate, (index, value) => {
        if (value.description) {
            $("#graduate").append(`
                <div id="graduatemodal${index}" class="modal">
                    <h4>${value.title}</h4>
                    <p>${value.description}</p>
                    <p id="graduateConcentration${index}">Concentrations: </p>
                    <a href="#" rel="modal:close"><button class="modalButton">Close</button></a>
                </div>

                <div class="degree">
                    <a href="#graduatemodal${index}" rel="modal:open">
                        ${value.title}
                    </a>
                </div>`
            );

            $.each(value.concentrations, (index2, value2) => {
                $(`#graduateConcentration${index}`).append(`${value2}, `);
            });
        } 
        else {
            $("#graduate").append(`
                <div id="graduatemodal${index}" class="modal">
                    <p id="certificates">Available certificates: </p>
                    <a href="#" rel="modal:close"><button class="modalButton">Close</button></a>
                </div>

                <div class="degree">
                    <a href="#graduatemodal${index}" rel="modal:open">
                        ${value.degreeName}
                    </a>
                </div>`
            );

            $.each(value.availableCertificates, (index2, value2) => {
                $('#certificates').append(`${value2}, `);
            });
        }
    });
}, 
    error => alert(`Error: ${error.message}`)
);

// Minors section===========================================================

url = "https://istclone.herokuapp.com/api/minors";
promise = getText(url);

promise.then(response => {
    let data = JSON.parse(response);

    $('#minorsSection').append("<div class=\"flexTitle\"><h2>Minors</h2></div>");

    $('#minorsSection').append("<div id=\"accordion\"></div>");
    
    $.each(data.UgMinors, (index, value) => {
        $("#accordion").append(`<h3>${value.title}</h3><div><p>${value.description}</p></div>`);
    })

    $(function() {
        $("#accordion").accordion();
    });
},
    error => alert(`Error: ${error.message}`)
);

// Employment section ==========================

url = "https://istclone.herokuapp.com/api/employment";
promise = getText(url);

promise.then(response => {
    let data = JSON.parse(response);

    const { introduction, degreeStatistics, employers, careers, coopTable, employmentTable } = data;
    
    $("#employmentSection").append("<div class=\"flexTitle\"><h2>" + introduction.title + "</h2></div>");

    $("#employmentSection").append("<div id=\"twoGrid\"></div>");

    const imgs = [
        'https://images.unsplash.com/photo-1551836022-aadb801c60ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
    ];

    $.each(introduction.content, (index, value) => {
        $("#twoGrid").append(`
            <div><img src="${imgs[index]}"></div> 

            <div>
                <h3>${value.title}</h3>
                <p>${value.description}</p>
            </div>`
        );
    });

    $("#employmentSection").append("<div class=\"flexTitle\"><h2>" + degreeStatistics.title + "</h2></div>");
    $("#employmentSection").append("<div id=\"statGrid\"></div>");

    $.each(degreeStatistics.statistics, (index, value) => {
        $("#statGrid").append(`<div class="statValue">${value.value}</div><div class="statDesc">${value.description}</div>`);
    });

    $("#employmentSection").append(`<h3 class="employmentTitle">${employers.title}:</h3>`);
    $("#employmentSection").append("<ul id=\"employersList\"></ul>");
    $.each(employers.employerNames, (index, value) => {
        $("#employersList").append(`<li>${value}, </li>`);
    });

    $("#employmentSection").append(`<h3 class="employmentTitle">${careers.title}:</h3>`);
    $("#employmentSection").append("<ul id=\"careersList\"></ul>");
    $.each(careers.careerNames, (index, value) => {
        $("#careersList").append(`<li>${value}, </li>`);
    });

    $("#employmentSection").append(`<div class="flexTitle"><h2>${coopTable.title}</h2></div>`);

    $("#employmentSection").append(`
        <table id=\"coopTable\">
            <thead>
                <tr>
                    <th>Employer</th>
                    <th>Degree</th>
                    <th>City</th>
                    <th>Term</th>
                </tr>
            </thead>
            <tbody id=\"coopTableBody\">
            </tbody>
        </table>`
    );

    $.each(coopTable.coopInformation, (index, value) => {
        $("#coopTableBody").append(`
            <tr>
                <td>${value.employer}</td>
                <td>${value.degree}</td>
                <td>${value.city}</td>
                <td>${value.term}</td>
            </tr>
        `);
    });

    $('#coopTable').DataTable();

    $("#employmentSection").append(`<div class="flexTitle"><h2>${employmentTable.title}</h2></div>`);

    $("#employmentSection").append(`
        <table id=\"employmentTable\">
            <thead>
                <tr>
                    <th>Employer</th>
                    <th>Degree</th>
                    <th>City</th>
                    <th>Title</th>
                    <th>Start Date</th>
                </tr>
            </thead>
            <tbody id=\"employmentTableBody\">
            </tbody>
        </table>`
    );

    $.each(employmentTable.professionalEmploymentInformation, (index, value) => {
        $("#employmentTableBody").append(`
            <tr>
                <td>${value.employer}</td>
                <td>${value.degree}</td>
                <td>${value.city}</td>
                <td>${value.title}</td>
                <td>${value.startDate}</td>
            </tr>
        `);
    });

    $('#employmentTable').DataTable();
});

// people section

url = "https://istclone.herokuapp.com/api/people";
promise = getText(url);

promise.then(response => {
    const data = JSON.parse(response);

    $("#peopleSection").append(`<div class="flexTitle"><h2>${data.title}</h2></div>`);
    $("#peopleSection").append(`<h4 class="flexTitle">${data.subTitle}</h4>`);
    $("#peopleSection").append(`<div id="facultyGrid"></div>`);

    $.each(data.faculty, (index, value) => {
        $("#facultyGrid").append(`
            <div class="card" id="">
                <div class="front">
                    <img src="${value.imagePath}" >
                    <div class="name">${value.name}</div>
                </div>
                <div class="back" id="back${index}">
                </div>
            </div>`
        );

        $.each(value, (index2, value2) => {
            if (index2 == 'username' || index2 == 'name' || index2 == 'title' || index2 == 'office' || index2 == 'phone' || index2 == 'email') {
                $(`#back${index}`).append(`<div><span class="backIndex">${index2}</span>: ${value2}</div>`);
            }
        });
    });

    $(".card").flip();
},
    error => alert(`Error: ${error.message}`)
);

// research section

url = "https://istclone.herokuapp.com/api/research";
promise = getText(url);

promise.then(response => {
    const data = JSON.parse(response);

    const { byInterestArea } = data;

    $("#researchSection").append(`<div class="flexTitle"><h2>Research</h2></div>`);

    $("#researchSection").append("<div id=\"tabs\"></div>");

    $("#tabs").append("<ul id=\"tabsUl\"></ul>");
    
    $.each(byInterestArea, (index, value) => {
        $("#tabsUl").append(`<li><a href="#${value.areaName}">${value.areaName}</a></li>`);
        $('#tabs').append(`<div id="${value.areaName}">${value.citations}</div>`);
    });

    $( function() {
        $( "#tabs" ).tabs();
    });
});

$("#map").append(`<div class="flexTitle"><h2>See Where Our Students Are Employed</h2></div>`);
$('#map').append(`<iframe id="map" src="http://ist.rit.edu/api/map.php" title="map"></iframe>`);

$('#form').append(`<iframe id="form" src="http://ist.rit.edu/api/contactForm.php" title="form"></iframe>`);


// footer section

url = "https://istclone.herokuapp.com/api/footer";
promise = getText(url);

promise.then(response => {
    const data = JSON.parse(response);
    const { social, quickLinks, copyright, news } = data;

    $('footer').append(`<div id="footerGrid"></div>`);
    $('#footerGrid').append(`<div id="first"></div>`);
    $('#footerGrid').append(`<div id="second"></div>`);
    $('#footerGrid').append(`<div id="third"></div>`);

    $('#first').append(`<div id="social">${social.title}</div>`); 
    $('#first').append(`<div><a href="${social.twitter}">RIT Twitter</a></div>`); 
    $('#first').append(`<div><a href="${social.facebook}">RIT Facebook</a></div>`); 

    $('#second').append(`<h4>${copyright.title}</h4>`);
    $('#second').append(copyright.html);

    $.each(quickLinks, (index, value) => {
        $('#third').append(`<div><a href="${value.href}">${value.title}</a></div>`); 
    });
});