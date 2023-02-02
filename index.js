"use strict";

const articles = {};

const missingTeam = "Choose Team...";

/**
 * 
 * @param {} teams List of teams which should be added to the given element
 * @param {*} parent Given element which will contain list of teams
 */
function addTeamsToElement(teams, parent) {
    parent.empty();
    parent.append($(`<option selected>${missingTeam}</option>`));

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

/**
 * Pick and remove a random article from a random team.
 */
function pickArticle() {
    const teams = Object.keys(articles);
    const teamArticleList = articles[teams[Math.floor(teams.length * Math.random())]];
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
        if ((teamNameStr != missingTeam) && (teamNameStr != "")
            && !(teamNameStr in articles)) { // only add team if it's not the default value, or already a team
            articles[teamNameStr] = []; // add team to articles
            const teams = Object.keys(articles);
            addTeamsToElement(teams, $("#add-article > select"));
            addTeamsToElement(teams, $("#get-article > select"));
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

        if ((teamNameStr != missingTeam) && (teamNameStr != "")
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
            const randomArticle = pickArticle();
            const articleName = `<h1 id="article-text" class="text-center border">${randomArticle}</h1>`
            displayDiv.append(articleName);
        }
    }
)
