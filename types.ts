
export type baseTreeItem = {
  sha: string;
  url: string;
}

export type rootTreeItem = {
  commit: {
    sha: string;
    commit: {
      tree: baseTreeItem;
    };
  };
};

export type childNodeItem = {
  sha: string,
  url: string;
  path: string,
  type: string,
  size?: number,
  tree?: childNodeItem[]
};



