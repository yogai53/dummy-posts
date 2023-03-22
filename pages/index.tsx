import { Filters, Main, Posts, Search, Sidebar } from "@/components";
import Error from "@/components/Error";
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
  const [showMenu, setShowMenu] = React.useState(false);

  // Use Effect: Fetch Posts
  React.useEffect(() => {
    fetchPosts();
  }, []);

  // Use Effect: Set search based on query params
  React.useEffect(() => {
    console.log("search", search);
    if (search) {
      setSearchTerm(Array.isArray(search) ? search[0] : search);
    }
  }, [search]);

  // Use Effect: Set filters from the post data and based on query params
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
  }, [postsData]);

  // Fetch Posts from API
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
    router.query.filters = [];
    router.push(router);
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
  }, [postsData, searchTerm, filteredKeys]);

  if (isLoading) {
    return <Loading />;
  }

  if (!postsData) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div>
        <aside
          className={`${
            !showMenu ? "hidden sm:block" : ""
          } border border-solid border-slate-300 m-2 h-full p-4 sm:fixed sm:w-1/5 sm:border-r-2 bg-slate-200 `}
        >
          <Sidebar>
            <>
              <div
                className="float-right underline sm:hidden"
                onClick={() => setShowMenu(false)}
              >
                (X) Close
              </div>
              <div className="sm:mt-10">
                <p className="mb-2 text-xl">Search</p>
                <Search
                  searchTerm={searchTerm}
                  handleSearchTerm={handleSearchTerm}
                />
              </div>
              <div className="mt-5 sm:mt-20">
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
                <button
                  className="w-full p-3 mt-4 text-lg text-white border border-solid sm:hidden border-slate-500 bg-slate-700"
                  onClick={() => setShowMenu(false)}
                >
                  Submit
                </button>
              </div>
            </>
          </Sidebar>
        </aside>
        {!showMenu && (
          <div
            className="left-0 p-3 m-2 bg-white border border-solid cursor-pointer w-100 sm:hidden top-1 border-slate-700"
            onClick={() => {
              setShowMenu(true);
            }}
          >
            Show Menu
          </div>
        )}
        <div
          className={`${showMenu ? "hidden sm:block" : ""} p-4 mt-0 sm:ml-80 `}
        >
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
