// ============================================
// FILE: src/components/forms/SearchFilter.tsx
// ============================================

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";
import { CATEGORIES, GENDERS } from "@/lib/constants";
import { StyleFilters } from "@/types";

interface SearchFilterProps {
	onFilterChange: (filters: StyleFilters) => void;
	onSearch: (query: string) => void;
}

export function SearchFilter({ onFilterChange, onSearch }: SearchFilterProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<StyleFilters>({
		category: undefined,
		gender: undefined,
		minPrice: undefined,
		maxPrice: undefined,
	});

	const handleFilterChange = (key: keyof StyleFilters, value: string | number | undefined) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	const clearFilters = () => {
		const emptyFilters: StyleFilters = {
			category: undefined,
			gender: undefined,
			minPrice: undefined,
			maxPrice: undefined,
		};
		setFilters(emptyFilters);
		onFilterChange(emptyFilters);
	};

	const activeFilterCount = Object.values(filters).filter(Boolean).length;

	return (
		<div className="space-y-4">
			{/* Search Bar */}
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search styles..."
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							onSearch(e.target.value);
						}}
						className="pl-10"
					/>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" className="relative">
							<Filter className="h-4 w-4 mr-2" />
							Filters
							{activeFilterCount > 0 && (
								<Badge
									variant="default"
									className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
								>
									{activeFilterCount}
								</Badge>
							)}
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Filter Styles</SheetTitle>
							<SheetDescription>
								Refine your search with these filters
							</SheetDescription>
						</SheetHeader>

						<div className="space-y-6 mt-6">

							{/* Category */}
							<div className="space-y-2">
								<Label>Category</Label>
								<Select
									value={filters.category || ""}
									onValueChange={(value) =>
										handleFilterChange("category", value || undefined)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="All categories" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All categories</SelectItem>
										{CATEGORIES.map((cat) => (
											<SelectItem key={cat.value} value={cat.value}>
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Gender */}
							<div className="space-y-2">
								<Label>Gender</Label>
								<Select
									value={filters.gender || ""}
									onValueChange={(value) =>
										handleFilterChange("gender", value as StyleFilters["gender"])
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="All genders" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All genders</SelectItem>
										{GENDERS.map((gender) => (
											<SelectItem key={gender.value} value={gender.value}>
												{gender.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Price Range */}
							<div className="space-y-4">
								<Label>Price Range</Label>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-xs">Min Price</Label>
										<Input
											type="number"
											placeholder="0"
											value={filters.minPrice || ""}
											onChange={(e) =>
												handleFilterChange(
													"minPrice",
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</div>
									<div>
										<Label className="text-xs">Max Price</Label>
										<Input
											type="number"
											placeholder="100000"
											value={filters.maxPrice || ""}
											onChange={(e) =>
												handleFilterChange(
													"maxPrice",
													e.target.value ? Number(e.target.value) : undefined
												)
											}
										/>
									</div>
								</div>
							</div>

							{/* Clear Filters */}
							<Button
								variant="outline"
								className="w-full"
								onClick={clearFilters}
								disabled={activeFilterCount === 0}
							>
								<X className="h-4 w-4 mr-2" />
								Clear All Filters
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Active Filters */}
			{activeFilterCount > 0 && (
				<div className="flex flex-wrap gap-2">
					{filters.category && (
						<Badge variant="secondary">
							{CATEGORIES.find((c) => c.value === filters.category)?.label}
							<button
								onClick={() => handleFilterChange("category", undefined)}
								className="ml-2"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{filters.gender && (
						<Badge variant="secondary">
							{GENDERS.find((g) => g.value === filters.gender)?.label}
							<button
								onClick={() => handleFilterChange("gender", undefined)}
								className="ml-2"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{filters.minPrice && (
						<Badge variant="secondary">
							Min: ₦{filters.minPrice}
							<button
								onClick={() => handleFilterChange("minPrice", undefined)}
								className="ml-2"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
					{filters.maxPrice && (
						<Badge variant="secondary">
							Max: ₦{filters.maxPrice}
							<button
								onClick={() => handleFilterChange("maxPrice", undefined)}
								className="ml-2"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}