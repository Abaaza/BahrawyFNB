import React from 'react';
import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from "@chakra-ui/icons";

function CaseCard({ detail, role, onClose, onAssign, children }) {
  if (!detail) return null;

  const actions = [];
  if (role === 'specialist' && !detail.assignedTo && onAssign) {
    actions.push(
      <MenuItem key="claim" onClick={() => onAssign(detail.id)}>
        Claim Case
      </MenuItem>,
    );
  }
  if (onClose) {
    actions.push(
      <MenuItem key="close" onClick={() => onClose(detail.id)}>
        Close Case
      </MenuItem>,
    );
  }

  return (
    <Box borderWidth="1px" rounded="md" p={2} mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Heading as="h3" size="md">
          Case {detail.clinCheckId}
        </Heading>
        {actions.length > 0 && (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>{actions}</MenuList>
          </Menu>
        )}
      </Box>
      {detail.link && (
        <Link href={detail.link} color="blue.500" textDecor="underline">
          ClinCheck Link
        </Link>
      )}
      <SimpleGrid columns={4} spacing={2} mt={2}>
        {Array.isArray(detail.photos) &&
          detail.photos.map((p) => (
            <Image key={p} src={p} alt="photo" objectFit="cover" h="6rem" />
          ))}
      </SimpleGrid>
      {children}
    </Box>
  );
}

export default CaseCard;
