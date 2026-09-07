import {PaginationNav} from './pagination-nav/pagination-nav.tsx';
import s from './pagination.module.css'

type Props={
  currentPage:number,
  pagesCount:number,
  onPageNumberChange:(page:number)=>void,
  isFetching:boolean
}

export const Pagination = ({currentPage,pagesCount,onPageNumberChange,isFetching}:Props) => {
  return (
    <div className={s.container}>
      <PaginationNav current={currentPage} pageCount={pagesCount} onChange={onPageNumberChange} isFetching={isFetching}/>{ isFetching && "🕥"}
    </div>
  )
}