'use strict';

const GitHubWebHooks = require('express-github-webhook');
const handler = GitHubWebHooks({ path: '/' });
const discord = require('../discord');
const discordData = require('../discord/discord.json');
const operationLogger = require('../loggers').operationLogger;

handler.on('push', (repo, data) => {
    discord
        .then(client => {
            return client
                .resolver
                .resolveGuild(discordData.server)
                .channels
                .find(channel => channel.id == discordData.channel)
                .sendMessage('`' + data.sender.login + '` has pushed to `' + repo + '` :\n' +
                data.commits.map(commit => '    `' + commit.id.substring(0, 6) + '` ' + commit.message + '\n'))
        })
        .catch(operationLogger.error.bind(operationLogger));
});

handler.on('issues', (repo, data) => {
    discord
        .then(client => {
            return client
                .resolver
                .resolveGuild(discordData.server)
                .channels
                .find(channel => channel.id == discordData.channel)
                .sendMessage('`' + data.sender.login + '` has ' + data.action + ' the issue `' + data.issue.number + '#' + data.issue.title + '`\n')
        })
        .catch(operationLogger.error.bind(operationLogger));
});

module.exports = handler;