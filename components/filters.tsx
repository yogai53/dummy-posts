import { Tag, TagMap } from "@/types/post";
import React from "react";

interface IProps {
  initialTagMap: TagMap;
  handleFilterChange: (tag: Tag, enabled: true | false) => void;
}

export default function Filters({ initialTagMap, handleFilterChange }: IProps) {
  const [tagMap, setTagMap] = React.useState<TagMap>({});

  React.useEffect(() => {
    setTagMap(initialTagMap);
  }, [initialTagMap]);

  return (
    <div>
      {Object.keys(tagMap).map((tag) => (
        <div key={tag} className="mb-1 cursor-pointer">
          <input
            id={tag}
            type="checkbox"
            name={tag}
            checked={tagMap[tag]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const tagMapClone = { ...tagMap };
              tagMapClone[tag] = e.target.checked;
              setTagMap(tagMapClone);
              handleFilterChange(tag, e.target.checked);
            }}
            className="cursor-pointer"
          />
          <label
            htmlFor={tag}
            className="ml-2 text-lg cursor-pointer select-none"
          >
            {tag}
          </label>
        </div>
      ))}
    </div>
  );
}
