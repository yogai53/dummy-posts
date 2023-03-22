import { Filters, Main, Posts, Search, Sidebar } from "@/components";
import Loading from "@/components/Loading";
import NoResults from "@/components/NoResults";
import { IPostsData, Tag, TagMap } from "@/types/post";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

export default function Home() {
  const router = useRouter();
  const { search, filters } = router.query;

  const [postsData, setPostsData] = React.useState<IPostsData>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [tagMap, setTagMap] = React.useState<TagMap>({});

  const fetchPosts = React.useCallback(async () => {
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
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, []);

  React.useEffect(() => {
    if (search) {
      setSearchTerm(Array.isArray(search) ? search[0] : search);
    }
  }, [search]);

  React.useEffect(() => {
    if (!postsData) return;
    let tagMap: TagMap = {};
    let initFilters = Array.isArray(filters) ? filters : [filters];

    postsData.posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap[tag] = initFilters.includes(tag) ? true : false;
      });
    });

    setTagMap(tagMap);
  }, [postsData, filters]);

  // On Search Term change
  const handleSearchTerm = React.useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
    router.query.search = searchTerm;
    router.push(router);
  }, []);

  // On Filter Change
  const handleFilterChange = React.useCallback(
    (tag: Tag, enabled = true) => {
      const tagMapClone = { ...tagMap };
      tagMapClone[tag] = enabled;
      setTagMap(tagMapClone);
      router.query.filters = Object.keys(tagMapClone)
        .filter((tag) => tagMapClone[tag] == true)
        .map((tag) => tag);
      router.push(router);
    },
    [tagMap]
  );

  // Clear filters
  const clearAllFilters = React.useCallback(() => {
    const tagMapClone = { ...tagMap };
    for (const tag in tagMapClone) {
      tagMapClone[tag] = false;
    }
    setTagMap(tagMapClone);
  }, [tagMap]);

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
    return <Loading />;
  }

  if (!postsData) {
    return <>Something went wrong. Posts data not available.</>;
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div>
        <aside className="fixed w-1/5 h-full p-4 border-r-2 border-solid border-slate-300 bg-slate-200">
          <Sidebar>
            <>
              <div className="mt-10">
                <p className="mb-2 text-xl">Search</p>
                <Search
                  searchTerm={searchTerm}
                  handleSearchTerm={handleSearchTerm}
                />
              </div>
              <div className="mt-20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl">Filters</p>
                  <div
                    className="text-sm underline cursor-pointer text-slate-600"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </div>
                </div>
                <Filters
                  initialTagMap={tagMap}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </>
          </Sidebar>
        </aside>
        <div className="p-4 sm:ml-80">
          {filteredPosts.length ? (
            <Posts
              posts={filteredPosts}
              total={postsData.total}
              search={searchTerm}
              tagMap={tagMap}
            />
          ) : (
            <NoResults />
          )}
        </div>
      </div>
    </>
  );
}
