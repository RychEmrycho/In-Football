var base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan dipanggil juka fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error: " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa di-then-kan
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk menghandle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error: " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {

    if ('caches' in window) {
        caches.match(base_url + "competitions/2014/standings").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    // Objek/array JavaScript dari response.json() masuk lewat data
                    // Menyusun komponen table row secara dinamis
                    var teamHtml = "";
                    data.standings[0].table.forEach(team => {
                        teamHtml += `
                        <tr>
                            <td>${team.position}</td>
                            <td><a href="./pages/detail.html?id=${team.team.id}" style="color: black">${team.team.name}</a></td>
                            <td>${team.playedGames}</td>
                            <td>${team.won}</td>
                            <td>${team.draw}</td>
                            <td>${team.lost}</td>
                            <td>${team.goalsFor}</td>
                            <td>${team.goalsAgainst}</td>
                            <td>${team.goalDifference}</td>
                            <td>${team.points}</td>
                            <td><img style="width: auto; height: 50px" class="responsive-img" src="${team.team.crestUrl}" /></td>
                        </tr>
                        `;
                    });

                    // Sisipkan elemen tr ke dalam tbody dengan id #postContainer
                    document.getElementById("postContainer").innerHTML = teamHtml;
                })
            }
        })
    }

    fetch(base_url + "competitions/2014/standings", {
            headers: {
                "X-Auth-Token": "df64738b897948ecb27455e0fe2c7c35"
            }
        }).then(status).then(json).then(function (data) {
            // Objek/array JavaScript dari response.json() masuk lewat data
            // Menyusun komponen table row secara dinamis
            var teamHtml = "";
            data.standings[0].table.forEach(team => {
                teamHtml += `
            <tr>
                <td>${team.position}</td>
                <td><a href="./pages/detail.html?id=${team.team.id}" style="color: black">${team.team.name}</a></td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td>${team.goalDifference}</td>
                <td>${team.points}</td>
                <td><img style="width: auto; height: 50px" class="responsive-img" src="${team.team.crestUrl}" /></td>
            </tr>
            `;
            });

            // Sisipkan elemen tr ke dalam tbody dengan id #postContainer
            document.getElementById("postContainer").innerHTML = teamHtml;
        })
        .catch(error);
}

function getTeamByID() {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ('caches' in window) {
        caches.match(base_url + "teams/" + idParam).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var teamDetailHtml = `
                        <div class="fixed-action-btn">
                            <a id="fabFavorite" class="waves-effect btn-floating btn-large red" onclick="toggleFavorite(${data.id}, '${data.name}', '${data.crestUrl}', '${data.website}')">
                                <i id="iconFavorite" class="large material-icons">favorite_border</i>
                            </a>
                        </div>
                        <div class="card" style="padding: 15px">
                            <div class="row">
                                <div class="col s12 m4 center">
                                    <img src="${data.crestUrl}" width="80%" class="responseive-img" />
                                    </div>
                                    <div class="col s12 m8">
                                    <p><small>Name:</small><br/>${data.name} (${data.shortName})</p>
                                    <p><small>Club colors:</small><br/>${data.clubColors}</p>
                                    <p><small>Address:</small><br/>${data.address}</p>
                                    <a href="${data.website}" style="color: black"><small>Website:</small><br/>${data.website}</a>
                                </div>
                            </div>
                        </div>
                    `;

                    teamDetailHtml += `
                    <h5>Squads</h5>
                    <div>
                        <table class="striped highlight responsive-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Shirt Number</th>
                                    <th>Nationality</th>
                                </tr>
                            </thead>
                            <tbody id="squadContainer">            
                    `;

                    data.squad.forEach(player => {
                        if (player.role !== "COACH") {
                            teamDetailHtml += `
                            <tr>
                                <td>${player.name}</td>
                                <td>${player.position}</td>
                                <td>${player.shirtNumber !== null ? player.shirtNumber : "-"}</td>
                                <td>${player.nationality}</td>
                            </tr>
                            `;
                        }
                    })

                    teamDetailHtml += `
                        </tbody>
                        </table>
                    </div>    
                    `;

                    document.getElementById("body-content").innerHTML = teamDetailHtml;
                    checkIsFavorite(idParam);
                })
            }
        })
    }

    fetch(base_url + "teams/" + idParam, {
        headers: {
            "X-Auth-Token": "df64738b897948ecb27455e0fe2c7c35"
        }
    }).then(status).then(json).then(function (data) {
        var teamDetailHtml = `
            <div class="fixed-action-btn">
                <a id="fabFavorite" class="waves-effect btn-floating btn-large red" onclick="toggleFavorite(${data.id}, '${data.name}', '${data.crestUrl}', '${data.website}')">
                    <i id="iconFavorite" class="large material-icons">favorite_border</i>
                </a>
            </div>
            <div class="card" style="padding: 15px">
                <div class="row">
                    <div class="col s12 m4 center">
                        <img src="${data.crestUrl}" width="80%" class="responseive-img" />
                        </div>
                        <div class="col s12 m8">
                        <p><small>Name:</small><br/>${data.name} (${data.shortName})</p>
                        <p><small>Club colors:</small><br/>${data.clubColors}</p>
                        <p><small>Address:</small><br/>${data.address}</p>
                        <a href="${data.website}" style="color: black"><small>Website:</small><br/>${data.website}</a>
                    </div>
                </div>
            </div>
        `;

        teamDetailHtml += `
        <h5>Squads</h5>
        <div>
            <table class="striped highlight responsive-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Shirt Number</th>
                        <th>Nationality</th>
                    </tr>
                </thead>
                <tbody id="squadContainer">            
        `;

        data.squad.forEach(player => {
            if (player.role !== "COACH") {
                teamDetailHtml += `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td>${player.shirtNumber !== null ? player.shirtNumber : "-"}</td>
                    <td>${player.nationality}</td>
                </tr>
                `;
            }
        })

        teamDetailHtml += `
            </tbody>
            </table>
        </div>    
        `;

        document.getElementById("body-content").innerHTML = teamDetailHtml;
        checkIsFavorite(idParam);
    }).catch(error);
}

function getMatchForCompetition() {

    if ('caches' in window) {
        caches.match(base_url + "competitions/2014/matches").then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    var scoreHtml = "";
                    data.matches.forEach(score => {
                        if (score.score.fullTime.homeTeam !== null && score.score.fullTime.awayTeam !== null) {
                            scoreHtml += `
                        <div class="row">
                            <div class="col s4 m4 center">
                                <a href="./pages/detail.html?id=${score.homeTeam.id}" style="color: black">${score.homeTeam.name}</a>
                            </div>
                            <div class="col s4 m4 center" style="background: #607d8b; color: #ffffff">
                                <h5>${score.score.fullTime.homeTeam} - ${score.score.fullTime.awayTeam}</h5>
                            </div>
                            <div class="col s4 m4 center">
                                <a href="./pages/detail.html?id=${score.awayTeam.id}" style="color: black">${score.awayTeam.name}</a>
                            </div>
                        </div>
                        `;
                        }
                    })

                    document.getElementById("scoreBoardContainer").innerHTML += scoreHtml;
                })
            }
        })
    }

    fetch(base_url + "competitions/2014/matches", {
        headers: {
            "X-Auth-Token": "df64738b897948ecb27455e0fe2c7c35"
        }
    }).then(status).then(json).then(function (data) {
        var scoreHtml = "";
        data.matches.forEach(score => {
            if (score.score.fullTime.homeTeam !== null && score.score.fullTime.awayTeam !== null) {
                scoreHtml += `
                <div class="row">
                    <div class="col s4 m4 center">
                        <p>${score.homeTeam.name}</p>
                    </div>
                    <div class="col s4 m4 center" style="background: #607d8b; color: #ffffff">
                        <h5>${score.score.fullTime.homeTeam} - ${score.score.fullTime.awayTeam}</h5>
                    </div>
                    <div class="col s4 m4 center">
                        <p>${score.awayTeam.name}</p>
                    </div>
                </div>
                `;
            }
        })

        document.getElementById("scoreBoardContainer").innerHTML += scoreHtml;
    }).catch(error);
}

function getFavoriteClubs() {

    var dbPromise = idb.open("db-infootball", 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains("clubs")) {
            var clubs = upgradeDb.createObjectStore("clubs", {
                keyPath: 'id_club'
            });
            // clubs.createIndex("id_club", "id_club", {
            //     unique: true
            // })
        }
    })

    dbPromise.then(function (db) {
        var tx = db.transaction('clubs', 'readonly');
        var store = tx.objectStore('clubs');
        return store.getAll();
    }).then(function (data) {
        // console.log("data yg diambil");
        // console.log(data);

        var teamHtml = "";
        data.forEach(team => {
            teamHtml += `
            <tr>
                <td><a href="./pages/detail.html?id=${team.id_club}" style="color: black">${team.name}</a></td>
                <td><a href="${team.url_website}" style="color: black">${team.url_website}</a></td>
                <td><img style="width: auto; height: 50px" class="responsive-img" src="${team.url_logo}" /></td>
            </tr>
            `;
        })
        document.getElementById("favoriteContainer").innerHTML += teamHtml;
    })
}