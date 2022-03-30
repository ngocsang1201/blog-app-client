import { SearchRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  Grow,
  List,
  ListItem,
  ListItemButton,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { blogActions, selectSearchLoading, selectSearchResultList } from 'features/blog/blogSlice';
import { Post } from 'models';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { slugifyString } from 'utils/common';
import { mixins, themeConstants } from 'utils/theme';
import { SearchMobile } from '../SearchMobile';

export interface SearchBoxProps {
  openSearchMobile?: boolean;
  toggleSearchMobile?: () => void;
}

export function SearchBox({ openSearchMobile, toggleSearchMobile }: SearchBoxProps) {
  const navigate = useNavigate();

  const { t } = useTranslation('header');

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectSearchLoading);
  const searchResultList = useAppSelector(selectSearchResultList);

  const [searchInput, setSearchInput] = useState<string>('');
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);

  useEffect(() => {
    if (searchInput.length > 0) {
      setShowSearchResult(true);
    } else {
      setShowSearchResult(false);
    }
  }, [searchInput]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    dispatch(blogActions.searchWithDebounce(slugifyString(value)));
  };

  const gotoPost = (post: Post) => {
    navigate(`/blog/${post.slug}`);
    setSearchInput('');
  };

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <FormControl
          fullWidth
          size="small"
          sx={{
            width: '100%',
            maxWidth: 360,
            position: { xs: 'relative', md: 'absolute' },
            top: { xs: 0, md: '50%' },
            left: { xs: 0, md: '50%' },
            transform: { xs: 'none', md: 'translate(-50%, -50%)' },
          }}
        >
          <OutlinedInput
            placeholder={t('search.placeholder')}
            inputProps={{ sx: { pl: 1.5 } }}
            value={searchInput}
            onChange={handleSearchChange}
            startAdornment={<SearchRounded sx={{ color: 'text.secondary' }} />}
          />

          <ClickAwayListener onClickAway={() => setShowSearchResult(false)}>
            <Grow in={showSearchResult}>
              <Paper
                elevation={0}
                sx={{
                  position: 'absolute',
                  inset: '100% 0 auto 0',
                  maxHeight: 450,
                  mt: 1,
                  bgcolor: 'background.default',
                  boxShadow: themeConstants.boxShadow,
                  overflow: 'scroll',
                }}
              >
                <Box display="flex" alignItems="center" p={2}>
                  {loading && (
                    <CircularProgress size={20} color="primary" sx={{ flexShrink: 0, mr: 1 }} />
                  )}

                  <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                    {!loading &&
                      t('search.result', {
                        count: searchResultList.length,
                        searchTerm: searchInput,
                      })}
                  </Typography>
                </Box>

                <List disablePadding>
                  {searchInput.length > 1 &&
                    searchResultList.map((post) => (
                      <ListItem key={post._id} disablePadding>
                        <ListItemButton disableRipple onClick={() => gotoPost(post)}>
                          <Stack direction="row" alignItems="center">
                            <Avatar
                              src={post.thumbnail}
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                bgcolor: 'grey.200',
                              }}
                            >
                              <Box />
                            </Avatar>

                            <Typography
                              variant="subtitle2"
                              fontSize={15}
                              sx={{ ...mixins.truncate(2) }}
                            >
                              {post.title}
                            </Typography>
                          </Stack>
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </FormControl>
      </Box>

      <SearchMobile
        open={openSearchMobile}
        onClose={toggleSearchMobile}
        loading={loading}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        searchResultList={searchResultList}
      />
    </>
  );
}