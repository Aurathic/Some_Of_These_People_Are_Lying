"use strict";

let articles = {};

const missingTeam = "Choose Team...";
const judgingTeam = "Choose Judging Team...";
const teamPlaceholders = [missingTeam, judgingTeam];

/**
 * 
 * @param {*} parent Given element which will contain list of teams
 * @param placeholder What text should be displayed first in the list as default value
 */
function addTeamsToElement(parent, placeholder) {
    const teams = Object.keys(articles); //List of teams which should be added to the given element

    parent.empty();
    parent.append($(`<option selected>${placeholder}</option>`));

    for (const team of teams) {
        const teamOption = $(`<option value='${team}'>${team}</option>`);
        parent.append(teamOption);
    }
}

/**
 * Return undefined if all teams have at least one article; 
 * otherwise, return the first team which has no articles left.
 */
function checkTeamsHaveArticles() {
    const teams = Object.keys(articles);
    for (const team of teams) {
        if (articles[team].length == 0) {
            return team;
        }
    }
    return undefined;
}

function addAlert(alertText) {
    const alert = $(`<div class="alert alert-warning" role="alert">${alertText}</div>`);
    $("#display").append(alert);
}

function addTeamsToDropdowns() {
    addTeamsToElement($("#add-article > select"), missingTeam);
    addTeamsToElement($("#get-article > select"), judgingTeam);
}

//https://stackoverflow.com/a/30832210
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    var a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

/**
 * Pick and remove a random article from a random team.
 */
function pickArticle(judgingTeam) {
    const teams = Object.keys(articles);
    let randomTeam = judgingTeam;
    while (randomTeam == judgingTeam) { //Don't draw an article from the judging team's set
        randomTeam = teams[Math.floor(teams.length * Math.random())];
    }
    console.log(randomTeam);
    const teamArticleList = articles[randomTeam];
    const articleIndex = Math.floor(teamArticleList.length * Math.random());
    const randomArticle = teamArticleList[articleIndex];
    teamArticleList.splice(articleIndex, 1);
    return randomArticle;
}

// Add Team
$("#add-team > button").click(
    function () {
        const teamName = $("#add-team > input");
        const teamNameStr = teamName.val().trim();
        if (!(teamNameStr in teamPlaceholders)
            && (teamNameStr != "")
            && !(teamNameStr in articles)) { // only add team if it's not the default value, or already a team
            articles[teamNameStr] = []; // add team to articles
            addTeamsToDropdowns();
            teamName.val(""); //Clear input field
        }
    }
)

// Add Article
$("#add-article > button").click(
    function () {
        const teamName = $("#add-article > select");
        const articleName = $("#add-article > input");
        const teamNameStr = teamName.val().trim();
        const articleNameStr = articleName.val().trim();

        if (!(teamNameStr in teamPlaceholders)
            && !(articleNameStr in articles[teamNameStr])) { // Only add article if it's not already in the list
            articles[teamNameStr].push(articleNameStr);
            console.log(articles);
            articleName.val(""); //Clear input field
        }
    }
)

// Get Article
$("#get-article > button").click(
    function () {
        const judgingTeam = $("#get-article > select");
        const judgingTeamStr = judgingTeam.val();

        if (judgingTeamStr != missingTeam) {
            const displayDiv = $("#display");
            displayDiv.empty();

            const teams = Object.keys(articles);
            const teamMissingArticles = checkTeamsHaveArticles();

            if (teams.length < 2) {
                // Display a warning if there aren't enough teams
                addAlert("Add at least 2 teams before picking an article.");
            }
            else if (teamMissingArticles) {
                // Add a warning to display div if some team is missing an element
                addAlert(`Team '${teamMissingArticles}' doesn't have any articles to pick from.`);
            } else {
                const randomArticle = pickArticle(judgingTeamStr);
                const articleName = `<h1 id="article-text" class="text-center border">${randomArticle}</h1>`
                displayDiv.append(articleName);
            }
        }
    }
)

$("#export").click(
    function () {
        const exportString = btoa(JSON.stringify(articles));
        //console.log(exportString);
        download(exportString, "export.txt", "text/html");
    }
)
$("#import").change(
    function () {
        const fileObj = $('#import').prop('files')[0];
        //https://stackoverflow.com/a/12282163/19678321
        var fr = new FileReader();
        fr.onload = function () {
            const articleJSON = JSON.parse(atob(fr.result));
            //console.log(articleJSON);
            articles = articleJSON;
            addTeamsToDropdowns();
        }
        fr.readAsText(fileObj);

    }
)

$(document).ready(
    function () {
        addTeamsToDropdowns();
    }
)