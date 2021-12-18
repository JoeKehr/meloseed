/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
// https://id.twitch.tv/oauth2/authorize?client_id=huw4s688t53v2bnv5c4otufas0pzhw&redirect_uri=https%3A%2F%2Fzenith-gainful-macaw.glitch.me%2Fwebhooks%2Fcallback&response_type=code&scope=channel%3Aread%3Asubscriptions%20channel%3Amanage%3Aredemptions%20channel%3Aread%3Aredemptions

const path = require("path");
const MusicGenerator = require("./music-generator.js");
//const parameters = require("./parameters.json").twitch;
const fetch = import("node-fetch");
const crypto = require("crypto");
const oauth = require("oauth");
const oauthSignature = require("oauth-signature");
const scope =
  "channel:read:subscriptions channel:manage:redemptions channel:read:redemptions";
const callback_url = "https://zenith-gainful-macaw.glitch.me/webhooks/callback";
const redirect_url = "https://zenith-gainful-macaw.glitch.me/webhooks/callback";

var connectionSocket = null;

console.log(MusicGenerator);
/*
let subscriptions = [
  {
    type: "channel.follow",
    version: "1",
    condition: {
      broadcaster_user_id: parameters.channel_id
    },
    transport: {
      method: "webhook",
      callback: callback_url,
      secret: parameters.sub_secret
    }
  },
  {
    type: "channel.channel_points_custom_reward_redemption.add",
    version: "1",
    condition: {
      broadcaster_user_id: parameters.channel_id
    },
    transport: {
      method: "webhook",
      callback: callback_url,
      secret: parameters.sub_secret
    }
  },
  {
    type: "stream.online",
    version: "1",
    condition: {
      broadcaster_user_id: parameters.channel_id
    },
    transport: {
      method: "webhook",
      callback: callback_url,
      secret: parameters.sub_secret
    }
  }
];
*/
// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE
//MusicGenerator.generate("follower");

// Setup our static files
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("fastify-formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});

fastify.get("/", function(request, reply) {
  reply.view("/index.html");
});

fastify.get("/music", function(request, reply) {
  var music = {
    data: MusicGenerator.generate(request.query.seed)
  }; 

  fastify.log.info(JSON.stringify(music));
  reply.send(music);
});

fastify.get("/v2/music", function(request, reply) {
  console.log(request.query);
  var music = MusicGenerator.generateV2(request.query);

  fastify.log.info(JSON.stringify(music));
  reply.send(music);
});

fastify.get("/v3/music", function(request, reply) {
  console.log(request.query);
  console.log("Before Generate")
  var music = MusicGenerator.generateV3(request.query);
  console.log("After Generate")
  fastify.log.info(JSON.stringify(music));
  reply.send(music);
});

fastify.get("/v4/music", function(request, reply) {
  console.log(request.query);
  console.log("Before Generate")
  var music = MusicGenerator.generateV4(request.query);
  console.log("After Generate")
  fastify.log.info(JSON.stringify(music));
  reply.send(music);
});

/*
//https://api.twitch.tv/helix/users
fastify.get("/test", function(request, reply) {
  if (request.params.login) {
    let login = request.params.login;

    fetchAccessToken()
      .then(res => res.json())
      .then(tokenJson => {
        console.log(tokenJson);
        return getAllFollowersData (login, tokenJson.access_token, []);
      })
      .then ((data) => {
        reply.send(data);
      })
  }
});

fastify.get("/followers/:login", function(request, reply) {
  if (request.params.login) {
    let login = request.params.login;

    fetchAccessToken()
      .then(res => res.json())
      .then(tokenJson => {
        console.log(tokenJson);
        return fetchUserData (login, tokenJson.access_token);
      })
      .then(res => res.json())
      .then(usersJson => {
        let usersList = {
          data: []
        };
        console.log(usersJson);
        if (usersJson.data.length > 0) {
          return fetchAccessToken()
                .then(res => res.json())
                .then(tokenJson => fetchFollowersData(usersJson.data[0].id, tokenJson.access_token))

        } else {
          reply.send(usersList);
        }
      })
      .then(res => res.json())
      .then(followersJson => {
        console.log(followersJson);
        reply.send(followersJson);
      });

  } else {
    reply.send({});
  }
});

fastify.get("/followers", function(request, reply) {
  fetchAccessToken()
    .then(res => res.json())
    .then(json => {
      console.log(json);
      return fetchFollowersData(parameters.channel_id, json.access_token);
    })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      reply.send(json);
    });
});

fastify.get("/users/:login", function(request, reply) {
  console.log(request.params);

  if (request.params.login) {
    let login = request.params.login;

    fetchAccessToken()
      .then(res => res.json())
      .then(json => {
        console.log(json);
        return fetchUserData(login, json.access_token);
      })
      .then(res => res.json())
      .then(userJson => {
        console.log(userJson);
        reply.send(userJson);
      });
  } else {
    reply.send({});
  }
});

// Callback pour les services souscrits et pour la demande d'accès aux services (interface graphique)
fastify.post("/webhooks/callback", function(request, reply) {
  console.log("WebHook Callback : ", request.body);
  if (!request.body.challenge) {
    if (connectionSocket) {
      connectionSocket.send(JSON.stringify(request.body));
    }
  }
  reply.send(request.body.challenge);
});

// Our home page route, this pulls from src/pages/index.hbs
fastify.get("/webhooks/callback", function(request, reply) {
  console.log("GET WebHook Callback : ", request.query.code);

  let oauth_params = {
    client_id: parameters.client_id,
    client_secret: parameters.client_secret,
    grant_type: "authorization_code",
    scope: scope,
    redirect_uri: redirect_url,
    code: request.query.code
  };

  fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: JSON.stringify(oauth_params),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => {
      subscribe(json);
    });

  reply.send(request.query);
});

function subscribe(json) {
  for (var i = 0; i < subscriptions.length; ++i) {
    fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
      method: "POST",
      body: JSON.stringify(subscriptions[i]),
      headers: {
        "Content-Type": "application/json",
        "Client-ID": parameters.client_id,
        Authorization: "Bearer " + json.access_token
      }
    })
      .then(res => res.json())
      .then(json => console.log(json));
  }
}

function fetchUserData(login, access_token) {
  return fetch("https://api.twitch.tv/helix/users?login=" + login, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Client-ID": parameters.client_id,
      Authorization: "Bearer " + access_token
    }
  });
}

function fetchFollowersData(id, access_token, cursor) {
  let cursorParam = "";
  if (cursor) {
    cursorParam = "&cursor=" + cursor;
  }
  return fetch(
    "https://api.twitch.tv/helix/users/follows?first=100&to_id=" +
      id +
      cursorParam,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Client-ID": parameters.client_id,
        Authorization: "Bearer " + access_token
      }
    }
  );
}

function fetchAccessToken() {
  let oauth_params = {
    client_id: parameters.client_id,
    client_secret: parameters.client_secret,
    grant_type: "client_credentials",
    scope: scope
  };

  return fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: JSON.stringify(oauth_params),
    headers: { "Content-Type": "application/json" }
  });
}

function getAllFollowersData(id, access_token, followers, cursor) {
  let cursorParam = "";
  if (cursor) {
    cursorParam = "&cursor=" + cursor;
  }
  return fetchFollowersData(id, access_token, cursor)
          .then(res => res.json())
          .then(followersJson => {
            return getAllFollowersData (id, access_token, followers, followersJson.pagination.cursor)
          });
}

*/


// Run the server and report out to the logs
fastify.listen(process.env.PORT, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
