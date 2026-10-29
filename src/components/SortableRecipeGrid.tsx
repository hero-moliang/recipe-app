import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getImage } from '../db';
import type { Recipe } from '../types';

type SortableItemProps = {
  recipe: Recipe;
  showHandle: boolean;
};

function SortableRecipeItem({ recipe, showHandle }: SortableItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    let url: string | null = null;
    getImage(recipe.id).then((blob) => {
      if (blob) {
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [recipe.id]);

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Link
        to={`/recipes/${recipe.id}`}
        className="block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 truncate">{recipe.title}</h3>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="inline-block px-1.5 py-0.5 text-[10px] bg-orange-50 text-orange-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">P{recipe.priority}</span>
          </div>
        </div>
      </Link>
      {showHandle && (
        <button
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
          </svg>
        </button>
      )}
    </div>
  );
}

type Props = {
  recipes: Recipe[];
  orderedIds: string[];
  showHandle: boolean;
  onReorder?: (newIds: string[]) => void;
};

export default function SortableRecipeGrid({ recipes, orderedIds, showHandle, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const orderedRecipes = orderedIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => r !== undefined);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onReorder) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedIds.indexOf(active.id as string);
    const newIndex = orderedIds.indexOf(over.id as string);

    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = [...orderedIds];
    newIds.splice(oldIndex, 1);
    newIds.splice(newIndex, 0, active.id as string);

    onReorder(newIds);
  };

  if (orderedRecipes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>暂无菜谱</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedIds}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-3">
          {orderedRecipes.map((recipe) => (
            <SortableRecipeItem
              key={recipe.id}
              recipe={recipe}
              showHandle={showHandle && orderedRecipes.length > 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
