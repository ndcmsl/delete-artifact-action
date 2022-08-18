import { getInput, setFailed } from '@actions/core';
import { Octokit } from "octokit";

const github_token = getInput('github_token');
const owner = getInput('owner');
const repo = getInput('repo');
const name = getInput('name');
const octokit = new Octokit({
    auth: github_token
  })

async function listArtifacts(): Promise<any> {

    return octokit.request('GET /repos/{owner}/{repo}/actions/artifacts', {
        owner,
        repo
      })
}

async function deleteArtifacts(artifacts: any) {

    artifacts.map(async (artifact) => {

        await octokit.request('DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}', {
            owner,
            repo,
            artifact_id: artifact.id
          })

        return;
    });
}
  
async function main() {

    let artifacts = await listArtifacts();
    artifacts = artifacts.data.artifacts.filter((artifact) => artifact.name == name);

    deleteArtifacts(artifacts);
}

try {
  main();
} catch (error) {
  setFailed(error.message);
}