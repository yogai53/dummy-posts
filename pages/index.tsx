import { Filters, Main, Posts, Search, Sidebar } from "@/components";
import { IPostsData, Tag, TagMap } from "@/types/post";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

export default function Home() {
  const [postsData, setPostsData] = React.useState<IPostsData>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tagMap, setTagMap] = React.useState<TagMap>({});

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const postsData = await fetch("https://dummyjson.com/posts");
      const postsDataJson = (await postsData.json()) as IPostsData;

      setPostsData(postsDataJson);
    } catch (error) {
      router.push("500");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  React.useEffect(() => {
    if (!postsData) return;
    let tagMap: TagMap = {};
    postsData.posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap[tag] = false;
      });
    });

    setTagMap(tagMap);
  }, [postsData]);

  // On Search Term change
  const handleSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // On Filter Change
  const handleFilterChange = (tag: Tag, enabled = true) => {
    const tagMapClone = { ...tagMap };
    tagMapClone[tag] = enabled;
    setTagMap(tagMapClone);
  };

  // Filtered Keys
  const filteredKeys = React.useMemo(() => {
    return Object.keys(tagMap).filter((tag) => tagMap[tag] == true);
  }, [tagMap]);

  // Post Filters based on the Search and Tag and Filters
  const filteredPosts = React.useMemo(() => {
    if (!postsData) return [];

    const searchedResults = !searchTerm.length
      ? postsData.posts
      : postsData.posts.filter((post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    const filteredResults = !filteredKeys.length
      ? searchedResults
      : searchedResults.filter((post) =>
          filteredKeys.every((tag) => post.tags.includes(tag))
        );
    return filteredResults;
  }, [postsData, searchTerm, tagMap, filteredKeys]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!postsData) {
    return <>Something went wrong. Posts data not available.</>;
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>

      <div className="flex">
        <Sidebar>
          <>
            <Search
              searchTerm={searchTerm}
              handleSearchTerm={handleSearchTerm}
            />
            <Filters
              initialTagMap={tagMap}
              handleFilterChange={handleFilterChange}
            />
          </>
        </Sidebar>
        <Main>
          <Posts posts={filteredPosts} total={postsData.total} />
        </Main>
      </div>
    </>
  );
}
