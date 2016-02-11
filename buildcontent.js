require('shelljs/global');

function installPackages() {
    console.log('Not content only. Install from npm');
    rm('-rf', 'node_modules/*');
    exec('npm install');
}
function isContentFile(file) {
    return file.startsWith('content/');
}

function isContentFiles(files) {
    for (var i = 0; i < files.length; i++) {
        if (!isContentFile(files[i])) {
            return false;
        }
    }
    return true;
}

function isContentOnlyCommit(commit) {
    var added = isContentFiles(commit.added);
    var removed = isContentFiles(commit.removed);
    var modified = isContentFiles(commit.modified);
    return added && removed && modified;
}

function isContentOnlyCommits(payload) {
    //If
    if (!payload.head_commit && !payload.commits) {
        return false;
    }
    var commits = payload.commits || [];
    if (payload.head_commit) {
        commits.push(payload.head_commit);
    }
    for (var i = 0; i < commits.length; i++) {
        if (!isContentOnlyCommit(commits[i])) {
            return false;
        }
    }
    return true;
}

function testCommit(payload) {
    //if there is commits that are not content then install packages from npm
    if (!isContentOnlyCommits(payload)) {
        installPackages();
    }
    else {
        console.log('Content only. Do not reinstall packages. This makes the deployment faster');
    }
}

try {
    var payload = require('./payload');
    testCommit(payload);
} catch (ex) {
    installPackages(ex);
}