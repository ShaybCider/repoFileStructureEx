#!/usr/bin/env node

import axios from "axios";
import { baseTreeItem, childNodeItem, rootTreeItem } from "./types";
const INITIAL_SHA_API_URL =
  "https://api.github.com/repos/cidersecurity/client-side-field-level-encryption-csfle-mongodb-node-demo/branches/main";

function buildNodeItem(sha: string, url: string, path: string,type: string, tree?: childNodeItem[]) : childNodeItem{
  return { sha, url, path, type, tree };
}

export async function getRootNode(): Promise<baseTreeItem> {
  const { data } = await axios.get<rootTreeItem>(INITIAL_SHA_API_URL);
  return data?.commit?.commit?.tree;
}


export async function getFileStructure(node: childNodeItem): Promise<childNodeItem> {
  let nodes: childNodeItem = {} as childNodeItem;
  const { data } = await axios.get<childNodeItem>(node.url);

  nodes = buildNodeItem(data.sha, data.url, node.path, node.type, []);

  for (let i = 0; i < data.tree.length; i++) {
    if (data.tree[i].type === "blob") {
      nodes.tree.push(data.tree[i]);
    } else if (data.tree[i].type === "tree") {
      nodes.tree.push(await getFileStructure(data.tree[i]));
    }
  }

  return nodes;
}

export async function startFileStructureCreation() {
  const baseTreeItem: baseTreeItem = await getRootNode();
  if(!baseTreeItem){
    console.log('Error in fetching repo main node, Exiting...');
    return;
  } 

  const rootNode = buildNodeItem(baseTreeItem.sha, baseTreeItem.url, 'main', 'tree', []);

  try{
    const repoFileStructure = await getFileStructure(rootNode);
    console.log(`Repo File Structure ==> \n  ${JSON.stringify(repoFileStructure, null, 2)}`);
  }catch(err){
    console.log(`Error in getting repo file structure. \nError message - ${err} \nExiting...`);
  }
}



startFileStructureCreation();

