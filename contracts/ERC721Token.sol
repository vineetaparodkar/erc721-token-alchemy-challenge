// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Token is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    uint256 MAX_SUPPLY_PER_USER = 5;

    mapping(address => uint256) nftOwnerRecord;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        address _minter
    ) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, _minter);
    }

    function safeMint(address to, string memory uri)
        public
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        require(
            (nftOwnerRecord[to] + 1) <= MAX_SUPPLY_PER_USER,
            "Minting reached the per user cap"
        );
        uint256 tokenId = _tokenIdCounter.current();
        nftOwnerRecord[to] += 1;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri); //setting token uri after token is minted with specific id
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        //order of execution ERC721 & ERC721URIStorage(both these contract have _burn,token/uri functions so need to ovrride in contracts deriving them)
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        //function checks to see if it implements the interfac..this function is called by external contracts,wallets
        return super.supportsInterface(interfaceId);
    }
}
